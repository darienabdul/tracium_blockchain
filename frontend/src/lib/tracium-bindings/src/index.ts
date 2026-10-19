import { Buffer } from "buffer";
import {
  AssembledTransaction,
  Client as ContractClient,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCSJEQAELXBA5O4INYOGU3AE5R5DGYYR4VMDZRQEKBU7WSGKWC5LE55Q",
  }
} as const

export type Role = {tag: "Technician", values: void} | {tag: "Inspector", values: void} | {tag: "ReturnToService", values: void} | {tag: "Quality", values: void} | {tag: "Auditor", values: void};

export type EventType = {tag: "Intervention", values: void} | {tag: "Inspection", values: void} | {tag: "ReturnToService", values: void} | {tag: "Correction", values: void};


export interface EventRecord {
  actor: string;
  content_hash: Buffer;
  corrects_event_id: Option<string>;
  event_id: string;
  event_type: EventType;
  intervention_id: string;
  previous_event_id: Option<string>;
  recorded_at: u64;
  sequence: u32;
}

export const ContractError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"Unauthorized"},
  4: {message:"InvalidInput"},
  5: {message:"DuplicateEvent"},
  6: {message:"InvalidSequence"},
  7: {message:"EventNotFound"},
  8: {message:"InvalidCorrection"},
  9: {message:"SequenceOverflow"},
  10: {message:"BatchTooLarge"},
  11: {message:"RoleNotFound"}
}

export interface Client {
  /**
   * Construct and simulate a get_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_role: ({account}: {account: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Option<Role>>>>

  /**
   * Construct and simulate a set_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_role: ({admin, account, role}: {admin: string, account: string, role: Option<Role>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_event: ({intervention_id, event_id}: {intervention_id: string, event_id: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Option<EventRecord>>>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a record_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  record_event: ({actor, intervention_id, event_id, event_type, content_hash, previous_event_id, corrects_event_id}: {actor: string, intervention_id: string, event_id: string, event_type: EventType, content_hash: Buffer, previous_event_id: Option<string>, corrects_event_id: Option<string>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a renew_role_ttl transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  renew_role_ttl: ({admin, accounts}: {admin: string, accounts: Array<string>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a transfer_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_admin: ({admin, new_admin}: {admin: string, new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a renew_event_ttl transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  renew_event_ttl: ({admin, intervention_id, event_ids}: {admin: string, intervention_id: string, event_ids: Array<string>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_latest_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_latest_event: ({intervention_id}: {intervention_id: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Option<EventRecord>>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAABFJvbGUAAAAFAAAAAAAAAAAAAAAKVGVjaG5pY2lhbgAAAAAAAAAAAAAAAAAJSW5zcGVjdG9yAAAAAAAAAAAAAAAAAAAPUmV0dXJuVG9TZXJ2aWNlAAAAAAAAAAAAAAAAB1F1YWxpdHkAAAAAAAAAAAAAAAAHQXVkaXRvcgA=",
        "AAAAAAAAAAAAAAAIZ2V0X3JvbGUAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAD6QAAA+gAAAfQAAAABFJvbGUAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAIc2V0X3JvbGUAAAADAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAAB2FjY291bnQAAAAAEwAAAAAAAAAEcm9sZQAAA+gAAAfQAAAABFJvbGUAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAJZ2V0X2V2ZW50AAAAAAAAAgAAAAAAAAAPaW50ZXJ2ZW50aW9uX2lkAAAAABAAAAAAAAAACGV2ZW50X2lkAAAAEAAAAAEAAAPpAAAD6AAAB9AAAAALRXZlbnRSZWNvcmQAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAgAAAAAAAAAAAAAACUV2ZW50VHlwZQAAAAAAAAQAAAAAAAAAAAAAAAxJbnRlcnZlbnRpb24AAAAAAAAAAAAAAApJbnNwZWN0aW9uAAAAAAAAAAAAAAAAAA9SZXR1cm5Ub1NlcnZpY2UAAAAAAAAAAAAAAAAKQ29ycmVjdGlvbgAA",
        "AAAAAAAAAAAAAAAMcmVjb3JkX2V2ZW50AAAABwAAAAAAAAAFYWN0b3IAAAAAAAATAAAAAAAAAA9pbnRlcnZlbnRpb25faWQAAAAAEAAAAAAAAAAIZXZlbnRfaWQAAAAQAAAAAAAAAApldmVudF90eXBlAAAAAAfQAAAACUV2ZW50VHlwZQAAAAAAAAAAAAAMY29udGVudF9oYXNoAAAD7gAAACAAAAAAAAAAEXByZXZpb3VzX2V2ZW50X2lkAAAAAAAD6AAAABAAAAAAAAAAEWNvcnJlY3RzX2V2ZW50X2lkAAAAAAAD6AAAABAAAAABAAAD6QAAAAQAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAQAAAAAAAAAAAAAAC0V2ZW50UmVjb3JkAAAAAAkAAAAAAAAABWFjdG9yAAAAAAAAEwAAAAAAAAAMY29udGVudF9oYXNoAAAD7gAAACAAAAAAAAAAEWNvcnJlY3RzX2V2ZW50X2lkAAAAAAAD6AAAABAAAAAAAAAACGV2ZW50X2lkAAAAEAAAAAAAAAAKZXZlbnRfdHlwZQAAAAAH0AAAAAlFdmVudFR5cGUAAAAAAAAAAAAAD2ludGVydmVudGlvbl9pZAAAAAAQAAAAAAAAABFwcmV2aW91c19ldmVudF9pZAAAAAAAA+gAAAAQAAAAAAAAAAtyZWNvcmRlZF9hdAAAAAAGAAAAAAAAAAhzZXF1ZW5jZQAAAAQ=",
        "AAAAAAAAAAAAAAAOcmVuZXdfcm9sZV90dGwAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIYWNjb3VudHMAAAPqAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAOdHJhbnNmZXJfYWRtaW4AAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAPcmVuZXdfZXZlbnRfdHRsAAAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAPaW50ZXJ2ZW50aW9uX2lkAAAAABAAAAAAAAAACWV2ZW50X2lkcwAAAAAAA+oAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAALAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADk5vdEluaXRpYWxpemVkAAAAAAACAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAADAAAAAAAAAAxJbnZhbGlkSW5wdXQAAAAEAAAAAAAAAA5EdXBsaWNhdGVFdmVudAAAAAAABQAAAAAAAAAPSW52YWxpZFNlcXVlbmNlAAAAAAYAAAAAAAAADUV2ZW50Tm90Rm91bmQAAAAAAAAHAAAAAAAAABFJbnZhbGlkQ29ycmVjdGlvbgAAAAAAAAgAAAAAAAAAEFNlcXVlbmNlT3ZlcmZsb3cAAAAJAAAAAAAAAA1CYXRjaFRvb0xhcmdlAAAAAAAACgAAAAAAAAAMUm9sZU5vdEZvdW5kAAAACw==",
        "AAAAAAAAAAAAAAAQZ2V0X2xhdGVzdF9ldmVudAAAAAEAAAAAAAAAD2ludGVydmVudGlvbl9pZAAAAAAQAAAAAQAAA+kAAAPoAAAH0AAAAAtFdmVudFJlY29yZAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_role: this.txFromJSON<Result<Option<Role>>>,
        set_role: this.txFromJSON<Result<void>>,
        get_event: this.txFromJSON<Result<Option<EventRecord>>>,
        initialize: this.txFromJSON<Result<void>>,
        record_event: this.txFromJSON<Result<u32>>,
        renew_role_ttl: this.txFromJSON<Result<void>>,
        transfer_admin: this.txFromJSON<Result<void>>,
        renew_event_ttl: this.txFromJSON<Result<void>>,
        get_latest_event: this.txFromJSON<Result<Option<EventRecord>>>
  }
}
