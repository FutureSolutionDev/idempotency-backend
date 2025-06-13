import Store from "./Store";

export default class IdempotencySession {
  #requestId: string;
  #responseData: unknown;
  constructor(requestId: string) {
    this.#requestId = requestId;
  }
  async CreateKey(ttlMs?: number): Promise<string> {
    return await Store.CreateKey(this.#requestId, ttlMs);
  }

  async GetKey(): Promise<string | null> {
    return await Store.GetKey(this.#requestId);
  }

  async SaveResponse(responseData: unknown): Promise<void> {
    await Store.SaveResponse(this.#requestId, responseData);
  }

  async GetResponse(): Promise<unknown | null> {
    return await Store.GetResponse(this.#requestId);
  }

  async Clear(): Promise<void> {
    await Store.Clear(this.#requestId);
  }
}
