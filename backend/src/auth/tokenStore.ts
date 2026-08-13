/**
 * Placeholder token persistence layer.
 *
 * This in-memory implementation is NOT suitable for a multi-instance
 * deployment (each instance would refresh independently). Replace with a
 * shared store (Redis, DB row, etc.) before production use — the exact
 * choice depends on deployment architecture, which per spec principle #10
 * should be inspected/decided against the real infrastructure, not assumed.
 *
 * The interface here is intentionally storage-agnostic so swapping the
 * backing store doesn't require changes in tokenManager.ts.
 */

export interface StoredToken {
  accessToken: string;
  refreshToken?: string;
  /** Epoch milliseconds when this token expires. */
  expiresAt: number;
}

class InMemoryTokenStore {
  private token: StoredToken | null = null;

  async get(): Promise<StoredToken | null> {
    return this.token;
  }

  async set(token: StoredToken): Promise<void> {
    this.token = token;
  }

  async clear(): Promise<void> {
    this.token = null;
  }
}

export const tokenStore = new InMemoryTokenStore();
