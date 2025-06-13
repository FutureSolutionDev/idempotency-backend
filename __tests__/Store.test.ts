import JsonIdempotencyStore from "@Idempotency/Store";
import fs from "fs/promises";
import path from "path";
const STORE_FILE = path.resolve("./__tests__/idempotency_store.json");
describe("JsonIdempotencyStore", () => {
  const requestId = "test-request-id";

  beforeEach(async () => {
    await fs.writeFile(STORE_FILE, JSON.stringify({}));
  });

  it("should create and retrieve a key", async () => {
    const key = await JsonIdempotencyStore.CreateKey(requestId);
    expect(typeof key).toBe("string");

    const storedKey = await JsonIdempotencyStore.GetKey(requestId);
    expect(storedKey).toBe(key);
  });

  it("should store and retrieve response", async () => {
    const response = { success: true };
    await JsonIdempotencyStore.SaveResponse(requestId, response);
    const cached = await JsonIdempotencyStore.GetResponse(requestId);
    expect(cached).toEqual(response);
  });

  it("should clear stored data", async () => {
    await JsonIdempotencyStore.CreateKey(requestId);
    await JsonIdempotencyStore.SaveResponse(requestId, { foo: "bar" });

    await JsonIdempotencyStore.Clear(requestId);
    const key = await JsonIdempotencyStore.GetKey(requestId);
    const response = await JsonIdempotencyStore.GetResponse(requestId);

    expect(key).toBe(null);
    expect(response).toBe(null);
  });

  it("should expire keys after TTL", async () => {
    const key = await JsonIdempotencyStore.CreateKey(requestId, 1);
    expect(typeof key).toBe("string");
    await new Promise((r) => setTimeout(r, 5));
    const expired = await JsonIdempotencyStore.GetKey(requestId);
    expect(expired).toBe(null);
  });
});
