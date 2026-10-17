#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, BytesN, Env,
    String, Vec,
};

const MAX_ID_LENGTH: u32 = 64;
const MAX_RENEWAL_BATCH: u32 = 50;
const TTL_THRESHOLD: u32 = 100_000;
const TTL_EXTEND_TO: u32 = 518_400;

#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum ContractError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InvalidInput = 4,
    DuplicateEvent = 5,
    InvalidSequence = 6,
    EventNotFound = 7,
    InvalidCorrection = 8,
    SequenceOverflow = 9,
    BatchTooLarge = 10,
    RoleNotFound = 11,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Role {
    Technician,
    Inspector,
    ReturnToService,
    Quality,
    Auditor,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum EventType {
    Intervention,
    Inspection,
    ReturnToService,
    Correction,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EventRecord {
    pub intervention_id: String,
    pub event_id: String,
    pub sequence: u32,
    pub event_type: EventType,
    pub content_hash: BytesN<32>,
    pub actor: Address,
    pub recorded_at: u64,
    pub previous_event_id: Option<String>,
    pub corrects_event_id: Option<String>,
}

#[contracttype]
enum DataKey {
    Admin,
    Role(Address),
    LatestEvent(String),
    Event(String, String),
}

#[contract]
pub struct TraciumRegistry;

#[contractimpl]
impl TraciumRegistry {
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }

        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        Self::bump_instance_ttl(&env);
        Ok(())
    }

    pub fn set_role(
        env: Env,
        admin: Address,
        account: Address,
        role: Option<Role>,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &admin)?;
        admin.require_auth();

        let key = DataKey::Role(account.clone());
        match role {
            Some(value) => {
                env.storage().persistent().set(&key, &value);
                Self::bump_persistent_ttl(&env, &key);
            }
            None => env.storage().persistent().remove(&key),
        }
        env.events().publish(
            (symbol_short!("role"), account),
            role,
        );
        Ok(())
    }

    pub fn transfer_admin(
        env: Env,
        admin: Address,
        new_admin: Address,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &admin)?;
        admin.require_auth();
        new_admin.require_auth();
        env.storage()
            .instance()
            .set(&DataKey::Admin, &new_admin);
        Self::bump_instance_ttl(&env);
        env.events()
            .publish((symbol_short!("admin"),), new_admin);
        Ok(())
    }

    pub fn get_role(env: Env, account: Address) -> Result<Option<Role>, ContractError> {
        Self::ensure_initialized(&env)?;
        let key = DataKey::Role(account);
        let role = env.storage().persistent().get(&key);
        if role.is_some() {
            Self::bump_persistent_ttl(&env, &key);
        }
        Ok(role)
    }

    pub fn record_event(
        env: Env,
        actor: Address,
        intervention_id: String,
        event_id: String,
        event_type: EventType,
        content_hash: BytesN<32>,
        previous_event_id: Option<String>,
        corrects_event_id: Option<String>,
    ) -> Result<u32, ContractError> {
        Self::ensure_initialized(&env)?;
        Self::validate_id(&intervention_id)?;
        Self::validate_id(&event_id)?;
        actor.require_auth();

        let required_role = match event_type {
            EventType::Intervention => Role::Technician,
            EventType::Inspection => Role::Inspector,
            EventType::ReturnToService => Role::ReturnToService,
            EventType::Correction => Role::Quality,
        };
        let role_key = DataKey::Role(actor.clone());
        let actor_role: Option<Role> = env.storage().persistent().get(&role_key);
        if actor_role != Some(required_role) {
            return Err(ContractError::Unauthorized);
        }
        Self::bump_persistent_ttl(&env, &role_key);

        let event_key = DataKey::Event(intervention_id.clone(), event_id.clone());
        if env.storage().persistent().has(&event_key) {
            return Err(ContractError::DuplicateEvent);
        }

        let latest_key = DataKey::LatestEvent(intervention_id.clone());
        let latest: Option<EventRecord> = env.storage().persistent().get(&latest_key);
        let sequence = match latest.as_ref() {
            None if previous_event_id.is_none() => 1,
            Some(record) if previous_event_id.as_ref() == Some(&record.event_id) => {
                record
                    .sequence
                    .checked_add(1)
                    .ok_or(ContractError::SequenceOverflow)?
            }
            _ => return Err(ContractError::InvalidSequence),
        };

        match (event_type, corrects_event_id.as_ref()) {
            (EventType::Correction, Some(corrected_id)) => {
                Self::validate_id(corrected_id)?;
                let corrected_key =
                    DataKey::Event(intervention_id.clone(), corrected_id.clone());
                if !env.storage().persistent().has(&corrected_key) {
                    return Err(ContractError::EventNotFound);
                }
                Self::bump_persistent_ttl(&env, &corrected_key);
            }
            (EventType::Correction, None) | (_, Some(_)) => {
                return Err(ContractError::InvalidCorrection);
            }
            (_, None) => {}
        }

        let record = EventRecord {
            intervention_id: intervention_id.clone(),
            event_id: event_id.clone(),
            sequence,
            event_type,
            content_hash,
            actor,
            recorded_at: env.ledger().timestamp(),
            previous_event_id,
            corrects_event_id,
        };

        env.storage().persistent().set(&event_key, &record);
        env.storage()
            .persistent()
            .extend_ttl(&event_key, TTL_THRESHOLD, TTL_EXTEND_TO);
        env.storage()
            .persistent()
            .set(&latest_key, &record);
        env.storage()
            .persistent()
            .extend_ttl(&latest_key, TTL_THRESHOLD, TTL_EXTEND_TO);
        env.events().publish(
            (
                symbol_short!("recorded"),
                intervention_id,
                event_id,
            ),
            record,
        );

        Ok(sequence)
    }

    pub fn get_event(
        env: Env,
        intervention_id: String,
        event_id: String,
    ) -> Result<Option<EventRecord>, ContractError> {
        Self::ensure_initialized(&env)?;
        let key = DataKey::Event(intervention_id, event_id);
        let record = env.storage().persistent().get(&key);
        if record.is_some() {
            Self::bump_persistent_ttl(&env, &key);
        }
        Ok(record)
    }

    pub fn get_latest_event(
        env: Env,
        intervention_id: String,
    ) -> Result<Option<EventRecord>, ContractError> {
        Self::ensure_initialized(&env)?;
        let key = DataKey::LatestEvent(intervention_id);
        let record = env.storage().persistent().get(&key);
        if record.is_some() {
            Self::bump_persistent_ttl(&env, &key);
        }
        Ok(record)
    }

    pub fn renew_event_ttl(
        env: Env,
        admin: Address,
        intervention_id: String,
        event_ids: Vec<String>,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &admin)?;
        admin.require_auth();
        Self::validate_id(&intervention_id)?;
        if event_ids.len() > MAX_RENEWAL_BATCH {
            return Err(ContractError::BatchTooLarge);
        }

        let latest_key = DataKey::LatestEvent(intervention_id.clone());
        if !env.storage().persistent().has(&latest_key) {
            return Err(ContractError::EventNotFound);
        }

        for event_id in event_ids.iter() {
            Self::validate_id(&event_id)?;
            let key = DataKey::Event(intervention_id.clone(), event_id);
            if !env.storage().persistent().has(&key) {
                return Err(ContractError::EventNotFound);
            }
            Self::bump_persistent_ttl(&env, &key);
        }
        Self::bump_persistent_ttl(&env, &latest_key);
        Ok(())
    }

    pub fn renew_role_ttl(
        env: Env,
        admin: Address,
        accounts: Vec<Address>,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &admin)?;
        admin.require_auth();
        if accounts.len() > MAX_RENEWAL_BATCH {
            return Err(ContractError::BatchTooLarge);
        }

        for account in accounts.iter() {
            let key = DataKey::Role(account);
            if !env.storage().persistent().has(&key) {
                return Err(ContractError::RoleNotFound);
            }
            Self::bump_persistent_ttl(&env, &key);
        }
        Ok(())
    }
}

impl TraciumRegistry {
    fn ensure_initialized(env: &Env) -> Result<Address, ContractError> {
        let admin: Option<Address> = env.storage().instance().get(&DataKey::Admin);
        match admin {
            Some(address) => {
                Self::bump_instance_ttl(env);
                Ok(address)
            }
            None => Err(ContractError::NotInitialized),
        }
    }

    fn require_admin(env: &Env, admin: &Address) -> Result<(), ContractError> {
        let stored_admin = Self::ensure_initialized(env)?;
        if stored_admin != *admin {
            return Err(ContractError::Unauthorized);
        }
        Ok(())
    }

    fn validate_id(id: &String) -> Result<(), ContractError> {
        if id.len() == 0 || id.len() > MAX_ID_LENGTH {
            return Err(ContractError::InvalidInput);
        }
        Ok(())
    }

    fn bump_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
    }

    fn bump_persistent_ttl(env: &Env, key: &DataKey) {
        env.storage()
            .persistent()
            .extend_ttl(key, TTL_THRESHOLD, TTL_EXTEND_TO);
    }
}

#[cfg(test)]
mod test {
    use super::{
        ContractError, EventRecord, EventType, Role, TraciumRegistry, TraciumRegistryClient,
    };
    use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String, Vec};

    #[test]
    fn records_events_and_links_corrections() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, TraciumRegistry);
        let client = TraciumRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let technician = Address::generate(&env);
        let quality_reviewer = Address::generate(&env);
        let intervention_id = String::from_str(&env, "work-order-42");
        let first_id = String::from_str(&env, "event-1");
        let second_id = String::from_str(&env, "event-2");
        let correction_id = String::from_str(&env, "event-3");
        let hash = BytesN::from_array(&env, &[7; 32]);

        client.initialize(&admin);
        client.set_role(&admin, &technician, &Some(Role::Technician));
        client.set_role(&admin, &quality_reviewer, &Some(Role::Quality));

        assert_eq!(
            client.record_event(
                &technician,
                &intervention_id,
                &first_id,
                &EventType::Intervention,
                &hash,
                &None,
                &None,
            ),
            1
        );
        assert_eq!(
            client.record_event(
                &technician,
                &intervention_id,
                &second_id,
                &EventType::Intervention,
                &hash,
                &Some(first_id.clone()),
                &None,
            ),
            2
        );
        assert_eq!(
            client.record_event(
                &quality_reviewer,
                &intervention_id,
                &correction_id,
                &EventType::Correction,
                &hash,
                &Some(second_id.clone()),
                &Some(first_id.clone()),
            ),
            3
        );

        let correction: Option<EventRecord> =
            client.get_event(&intervention_id, &correction_id);
        let correction = correction.expect("correction should be stored");
        assert_eq!(correction.sequence, 3);
        assert_eq!(correction.previous_event_id, Some(second_id));
        assert_eq!(correction.corrects_event_id, Some(first_id));
    }

    #[test]
    fn rejects_a_sequence_that_does_not_extend_the_latest_event() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, TraciumRegistry);
        let client = TraciumRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let technician = Address::generate(&env);
        let intervention_id = String::from_str(&env, "work-order-84");
        let first_id = String::from_str(&env, "event-1");
        let invalid_id = String::from_str(&env, "event-2");
        let hash = BytesN::from_array(&env, &[9; 32]);

        client.initialize(&admin);
        client.set_role(&admin, &technician, &Some(Role::Technician));
        client.record_event(
            &technician,
            &intervention_id,
            &first_id,
            &EventType::Intervention,
            &hash,
            &None,
            &None,
        );

        assert_eq!(
            client.try_record_event(
                &technician,
                &intervention_id,
                &invalid_id,
                &EventType::Intervention,
                &hash,
                &None,
                &None,
            ),
            Err(Ok(ContractError::InvalidSequence))
        );
    }

    #[test]
    fn renews_persistent_event_entries_in_bounded_batches() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, TraciumRegistry);
        let client = TraciumRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let technician = Address::generate(&env);
        let intervention_id = String::from_str(&env, "work-order-85");
        let event_id = String::from_str(&env, "event-1");
        let hash = BytesN::from_array(&env, &[3; 32]);

        client.initialize(&admin);
        client.set_role(&admin, &technician, &Some(Role::Technician));
        client.record_event(
            &technician,
            &intervention_id,
            &event_id,
            &EventType::Intervention,
            &hash,
            &None,
            &None,
        );

        let mut event_ids = Vec::new(&env);
        event_ids.push_back(event_id);
        client.renew_event_ttl(&admin, &intervention_id, &event_ids);
    }
}
