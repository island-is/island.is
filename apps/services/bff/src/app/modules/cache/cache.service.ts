import { Inject, Injectable } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'

import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
  ) {}

  /**
   * Creates s unique key with session id.
   * Type is either 'attempt' or 'current'.
   * `attempt` represents the login attempt.
   * `current` represents the current login session.
   */
  public createSessionKeyType(type: 'attempt' | 'current', sid: string) {
    return `${type}_${sid}`
  }

  public async save({
    key,
    value,
    ttl,
  }: {
    key: string
    value: unknown
    // Time to live in milliseconds
    ttl?: number
  }): Promise<void> {
    await this.cacheManager.set(key, value, ttl)
  }

  public async get<Value>(key: string) {
    const value = await this.cacheManager.get(key)

    if (!value) {
      throw new Error(`Cache key "${key}" not found.`)
    }

    return value as Value
  }

  public async delete(key: string) {
    await this.cacheManager.del(key)
  }
}
