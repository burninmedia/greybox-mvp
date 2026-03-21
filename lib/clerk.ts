// Utility functions for API key management
// NOTE: Clerk SDK is not imported here to avoid module-level initialization
// that causes build failures when env vars are missing.

export function generateApiKey(): string {
  const prefix = "gbx";
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = prefix + "_";
  for (let i = 0; i < 40; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export function hashApiKey(key: string): string {
  // Simple hash for storage — in prod use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
