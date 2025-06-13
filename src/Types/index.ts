export interface IdempotencyMeta {
  key: string;
  expiresAt: number | null;
}

export interface IdempotencyResponse {
  responseData: unknown;
  savedAt: number;
}

export type StoreData = Record<string, IdempotencyMeta | IdempotencyResponse>;