import { IdempotencyMeta, IdempotencyResponse, StoreData } from "@Types/index";
import { ReadJSON, WriteJSON } from "@Utils/fileUtils";
import { GetTimestamp, UUID } from "@Utils/helpers";
import path from "path";
const DATA_FILE = path.resolve("./idempotency_store.json");

export default class JsonIdempotencyStore {
  static async CreateKey(requestId: string, ttlMs?: number): Promise<string> {
    const key = UUID();
    const expiresAt = ttlMs ? GetTimestamp() + ttlMs : null;
    const store = await ReadJSON<StoreData>(DATA_FILE);
    store[`${requestId}::meta`] = { key, expiresAt };
    await WriteJSON(DATA_FILE, store);
    return key;
  }

  static async GetKey(requestId: string): Promise<string | null> {
    const store = await ReadJSON<StoreData>(DATA_FILE);
    const meta = store[`${requestId}::meta`] as IdempotencyMeta;
    if (!meta) return null;
    if (meta.expiresAt && meta.expiresAt < GetTimestamp()) {
      await this.Clear(requestId);
      return null;
    }
    return meta.key;
  }

  static async SaveResponse(
    requestId: string,
    responseData: unknown
  ): Promise<void> {
    const store = await ReadJSON<StoreData>(DATA_FILE);
    store[`${requestId}::response`] = {
      responseData,
      savedAt: GetTimestamp(),
    };
    await WriteJSON(DATA_FILE, store);
  }

  static async GetResponse(requestId: string): Promise<unknown | null> {
    const store = await ReadJSON<StoreData>(DATA_FILE);
    return (
      (store[`${requestId}::response`] as IdempotencyResponse)?.responseData ||
      null
    );
  }

  static async Clear(requestId: string): Promise<void> {
    const store = await ReadJSON<StoreData>(DATA_FILE);
    delete store[`${requestId}::meta`];
    delete store[`${requestId}::response`];
    await WriteJSON(DATA_FILE, store);
  }
}
