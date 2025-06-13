import fs from 'fs/promises';
import path from 'path'
const DATA_FILE = path.resolve("./idempotency_store.json");
export async function ReadJSON<T>(): Promise<T> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {} as T;
  }
}
export async function WriteJSON<T>( data: T): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}