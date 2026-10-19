import { Buffer } from "buffer";
import {
  getAddress,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Client as TraciumClient,
  networks,
  type EventType,
} from "./tracium-bindings/src/index";

export type ChainEventType = "Intervention" | "Inspection" | "ReturnToService";

export type ChainAnchor = {
  interventionId: string;
  eventId: string;
  eventType: ChainEventType;
  contentHash: string;
  actor: string;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
  sequence?: number;
  error?: string;
  updatedAt: string;
};

const anchorsKey = "tracium-chain-anchors-v1";
const walletKey = "tracium-stellar-wallet-v1";
const network = networks.testnet;

function contractId(): string {
  return import.meta.env.PUBLIC_STELLAR_CONTRACT_ID || network.contractId;
}

function rpcUrl(): string {
  return import.meta.env.PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org";
}

function getStoredAnchors(): Record<string, ChainAnchor> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(anchorsKey) ?? "{}");
    return typeof value === "object" && value !== null ? value as Record<string, ChainAnchor> : {};
  } catch {
    return {};
  }
}

function setStoredAnchors(value: Record<string, ChainAnchor>): void {
  localStorage.setItem(anchorsKey, JSON.stringify(value));
}

export function getChainAnchor(eventId: string): ChainAnchor | undefined {
  return getStoredAnchors()[eventId];
}

export function getChainAnchorsForIntervention(interventionId: string): ChainAnchor[] {
  return Object.values(getStoredAnchors()).filter((anchor) => anchor.interventionId === interventionId);
}

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalize(item)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

async function sha256(value: unknown): Promise<Buffer> {
  const bytes = new TextEncoder().encode(canonicalize(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Buffer.from(digest);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "No se pudo completar la operación en Stellar.";
}

async function walletAddress(): Promise<string> {
  const response = await getAddress();
  if (response.error || !response.address) {
    throw new Error("Conecta una wallet Freighter antes de registrar el evento.");
  }
  localStorage.setItem(walletKey, response.address);
  return response.address;
}

function clientFor(address: string): TraciumClient {
  return new TraciumClient({
    contractId: contractId(),
    rpcUrl: rpcUrl(),
    networkPassphrase: network.networkPassphrase,
    publicKey: address,
    signTransaction,
  });
}

function eventType(value: ChainEventType): EventType {
  return { tag: value, values: undefined } as EventType;
}

export async function connectWallet(): Promise<string> {
  const access = await requestAccess();
  if (access.error || !access.address) {
    throw new Error("Freighter no autorizó el acceso a la cuenta.");
  }
  localStorage.setItem(walletKey, access.address);
  return access.address;
}

export function storedWalletAddress(): string | null {
  return localStorage.getItem(walletKey);
}

export async function anchorEvent(input: {
  interventionId: string;
  eventId: string;
  eventType: ChainEventType;
  payload: unknown;
  linkToLatest?: boolean;
  expectedPreviousEventType?: ChainEventType;
}): Promise<ChainAnchor> {
  const existing = getChainAnchor(input.eventId);
  if (existing?.status === "confirmed") return existing;

  const actor = await walletAddress();
  const client = clientFor(actor);
  let previousEventId: string | undefined;

  if (input.linkToLatest) {
    const latest = await client.get_latest_event({ intervention_id: input.interventionId });
    const latestResult = latest.result.unwrap();
    previousEventId = latestResult?.event_id;
    if (!latestResult) {
      throw new Error("No existe un evento anterior anclado para enlazar este registro.");
    }
    if (input.expectedPreviousEventType && latestResult.event_type.tag !== input.expectedPreviousEventType) {
      throw new Error(`El último evento en Stellar es ${latestResult.event_type.tag}; se esperaba ${input.expectedPreviousEventType}.`);
    }
  }

  const contentHash = await sha256({
    version: 1,
    eventType: input.eventType,
    interventionId: input.interventionId,
    eventId: input.eventId,
    payload: input.payload,
  });
  const now = new Date().toISOString();
  const pending: ChainAnchor = {
    interventionId: input.interventionId,
    eventId: input.eventId,
    eventType: input.eventType,
    contentHash: contentHash.toString("hex"),
    actor,
    status: "pending",
    updatedAt: now,
  };
  const anchors = getStoredAnchors();
  anchors[input.eventId] = pending;
  setStoredAnchors(anchors);

  try {
    const transaction = await client.record_event({
      actor,
      intervention_id: input.interventionId,
      event_id: input.eventId,
      event_type: eventType(input.eventType),
      content_hash: contentHash,
      previous_event_id: previousEventId,
      corrects_event_id: undefined,
    });
    const sent = await transaction.signAndSend();
    const sequence = sent.result.unwrap();
    const confirmed: ChainAnchor = {
      ...pending,
      status: "confirmed",
      txHash: sent.sendTransactionResponse?.hash,
      sequence,
      updatedAt: new Date().toISOString(),
    };
    anchors[input.eventId] = confirmed;
    setStoredAnchors(anchors);
    return confirmed;
  } catch (error) {
    const failed: ChainAnchor = { ...pending, status: "failed", error: errorMessage(error), updatedAt: new Date().toISOString() };
    anchors[input.eventId] = failed;
    setStoredAnchors(anchors);
    throw new Error(failed.error);
  }
}
