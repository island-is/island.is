import type { Cluster } from 'ioredis'

import type { StepUpMethod } from '@island.is/auth/step-up'

export const STEP_UP_STORE = 'STEP_UP_STORE'

/** A step-up that has been started and not yet answered. */
export interface PendingStepUp {
  authReqId: string
  /** The session that started it. Only that session may ask about it. */
  sessionKey: string
  /**
   * Who must approve (the actor when acting for someone, else the subject), as
   * a keyed hash: their national id is never stored.
   */
  personKey: string
  method: StepUpMethod
  startedAt: number
  /** Approved and recorded; kept briefly so a repeated poll answers the same. */
  confirmed?: boolean
}

/** Proof that the person behind a session was present recently. */
export interface Unlock {
  /** When the person approved, per the identity server. Epoch ms. */
  authTime: number
  /** When we recorded it; the absolute limit counts from here. Epoch ms. */
  unlockedAt: number
  /** Keyed MAC over the session and both times, so a planted record is refused. */
  signature: string
}

/**
 * Where step-up state lives. Everything here is short-lived and safe to lose:
 * losing it only means the person unlocks again.
 */
export interface StepUpStore {
  setPending(
    id: string,
    value: PendingStepUp,
    ttlSeconds: number,
  ): Promise<void>
  getPending(id: string): Promise<PendingStepUp | null>
  deletePending(id: string): Promise<void>
  setUnlock(
    sessionKey: string,
    value: Unlock,
    ttlSeconds: number,
  ): Promise<void>
  getUnlock(sessionKey: string): Promise<Unlock | null>
  deleteUnlock(sessionKey: string): Promise<void>
  /** Counts a start for the person and returns the count in the current window. */
  countStart(personKey: string, windowSeconds: number): Promise<number>
}

const keys = {
  pending: (id: string) => `pending:${id}`,
  unlock: (sessionKey: string) => `unlock:${sessionKey}`,
  starts: (personKey: string) => `starts:${personKey}`,
}

export class RedisStepUpStore implements StepUpStore {
  constructor(private readonly redis: Cluster) {}

  async setPending(id: string, value: PendingStepUp, ttlSeconds: number) {
    await this.redis.set(
      keys.pending(id),
      JSON.stringify(value),
      'EX',
      ttlSeconds,
    )
  }

  async getPending(id: string) {
    return parse<PendingStepUp>(await this.redis.get(keys.pending(id)))
  }

  async deletePending(id: string) {
    await this.redis.del(keys.pending(id))
  }

  async setUnlock(sessionKey: string, value: Unlock, ttlSeconds: number) {
    await this.redis.set(
      keys.unlock(sessionKey),
      JSON.stringify(value),
      'EX',
      ttlSeconds,
    )
  }

  async getUnlock(sessionKey: string) {
    return parse<Unlock>(await this.redis.get(keys.unlock(sessionKey)))
  }

  async deleteUnlock(sessionKey: string) {
    await this.redis.del(keys.unlock(sessionKey))
  }

  async countStart(personKey: string, windowSeconds: number) {
    const key = keys.starts(personKey)
    const count = await this.redis.incr(key)
    if (count === 1) {
      await this.redis.expire(key, windowSeconds)
    }
    return count
  }
}

/**
 * For a developer machine without Redis, and for tests. Per process, so with
 * more than one replica an unlock on one is unknown to the others — which
 * locks people out rather than letting anyone in.
 */
export class MemoryStepUpStore implements StepUpStore {
  private readonly entries = new Map<
    string,
    { value: string; expiresAt: number }
  >()

  constructor(private readonly now: () => number = Date.now) {}

  async setPending(id: string, value: PendingStepUp, ttlSeconds: number) {
    this.put(keys.pending(id), JSON.stringify(value), ttlSeconds)
  }

  async getPending(id: string) {
    return parse<PendingStepUp>(this.read(keys.pending(id)))
  }

  async deletePending(id: string) {
    this.entries.delete(keys.pending(id))
  }

  async setUnlock(sessionKey: string, value: Unlock, ttlSeconds: number) {
    this.put(keys.unlock(sessionKey), JSON.stringify(value), ttlSeconds)
  }

  async getUnlock(sessionKey: string) {
    return parse<Unlock>(this.read(keys.unlock(sessionKey)))
  }

  async deleteUnlock(sessionKey: string) {
    this.entries.delete(keys.unlock(sessionKey))
  }

  async countStart(personKey: string, windowSeconds: number) {
    const key = keys.starts(personKey)
    const existing = this.entries.get(key)
    if (!existing || existing.expiresAt <= this.now()) {
      this.put(key, '1', windowSeconds)
      return 1
    }
    const count = Number(existing.value) + 1
    existing.value = String(count)
    return count
  }

  private put(key: string, value: string, ttlSeconds: number) {
    this.entries.set(key, { value, expiresAt: this.now() + ttlSeconds * 1000 })
  }

  private read(key: string): string | null {
    const entry = this.entries.get(key)
    if (!entry) {
      return null
    }
    if (entry.expiresAt <= this.now()) {
      this.entries.delete(key)
      return null
    }
    return entry.value
  }
}

const parse = <T>(value: string | null): T | null => {
  if (!value) {
    return null
  }
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}
