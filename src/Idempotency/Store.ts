import { IdempotencyMeta, IdempotencyResponse, StoreData } from "../Types";
import { ReadJSON, WriteJSON } from "../_Utils/FileUtils";
import { GetTimestamp, UUID } from "../_Utils/Helpers";

export default class JsonIdempotencyStore {
  static async CreateKey(requestId: string, ttlMs?: number): Promise<string> {
    const key = UUID();
    const expiresAt = ttlMs ? GetTimestamp() + ttlMs : null;
    const store = await ReadJSON<StoreData>();
    store[`${requestId}::meta`] = { key, expiresAt };
    await WriteJSON(store);
    return key;
  }

  static async GetKey(requestId: string): Promise<string | null> {
    const store = await ReadJSON<StoreData>();
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
    const store = await ReadJSON<StoreData>();
    store[`${requestId}::response`] = {
      responseData,
      savedAt: GetTimestamp(),
    };
    await WriteJSON(store);
  }

  static async GetResponse(requestId: string): Promise<unknown | null> {
    const store = await ReadJSON<StoreData>();
    return (
      (store[`${requestId}::response`] as IdempotencyResponse)?.responseData ||
      null
    );
  }

  static async Clear(requestId: string): Promise<void> {
    const store = await ReadJSON<StoreData>();
    delete store[`${requestId}::meta`];
    delete store[`${requestId}::response`];
    await WriteJSON(store);
  }
}
