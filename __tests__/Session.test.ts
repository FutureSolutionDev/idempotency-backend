import IdempotencySession from '@Idempotency/Session';
import fs from 'fs/promises';
import path from 'path';
const STORE_FILE = path.resolve('./__tests__/idempotency_store.json');

beforeEach(async () => {
  await fs.writeFile(STORE_FILE, JSON.stringify({}, null, 2));
});

describe('Session', () => {
  const requestId = 'session-test-id';

  it('should create and retrieve a key', async () => {
    const session = new IdempotencySession(requestId);
    const key = await session.CreateKey(1000);
    const fetchedKey = await session.GetKey();
    expect(fetchedKey).toBe(key);
  });

  it('should save and get response', async () => {
    const session = new IdempotencySession(requestId);
    const response = { message: 'Success' };
    await session.SaveResponse(response);
    const result = await session.GetResponse();
    expect(result).toEqual(response);
  });

  it('should clear key and response', async () => {
    const session = new IdempotencySession(requestId);
    await session.CreateKey(1000);
    await session.SaveResponse({ ok: true });
    await session.Clear();
    expect(await session.GetKey()).toBeNull();
    expect(await session.GetResponse()).toBeNull();
  });
});
