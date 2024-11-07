import { Inject, Injectable } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'

import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
  ) {}

  public createKeyError(key: string) {
    return `Cache key "${key}" not found.`
  }

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

  /**
   * Gets a value from the cache.
   *
   * @param key The key to get the value for.
   * @param throwError If true, throws an error if the key is not found.
   *
   * @returns cache value
   */
  public async get<Value>(key: string, throwError = true): Promise<Value> {
    const value = await this.cacheManager.get(key)

    if (!value && throwError) {
      throw new Error(this.createKeyError(key))
    }

    return value as Value
  }

  public async delete(key: string) {
    try {
      await this.cacheManager.del(key)
    } catch (error) {
      throw new Error(`Failed to delete key "${key}" from cache.`)
    }
  }
}
