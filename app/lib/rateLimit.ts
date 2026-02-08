type RateEntry = {
  count: number;
  timestamp: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;
const store = new Map<string, RateEntry>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW_MS) {
    store.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  store.set(key, entry);
  return false;
}
