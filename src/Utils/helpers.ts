import crypto from 'crypto';

export function UUID(): string {
  return crypto.randomUUID();
}

export function GetTimestamp(): number {
  return Date.now();
}
