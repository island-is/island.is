import { Inject, Injectable } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'

import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigType } from '@nestjs/config'
import { BffConfig } from '../../bff.config'

@Injectable()
export class CacheService {
  private separator = '::'

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,
  ) {}

  /**
   * If the key contains multiple parts separated by separator,
   * it will keep only the first two parts to ensure no session id or other sensitive data is leaked to logs.
   * If the key has less than two parts, it will return the key as is.
   *
   * @example
   * keyWithoutSid('attempt::some_name::1234') // attempt::some_name
   * keyWithoutSid('attempt::some_name::1234::extra') // attempt::some_name
   * keyWithoutSid('some_name::1234') // some_name::1234
   * keyWithoutSid('some_name') // some_name
   */
  private keyWithoutSid(key: string): string {
    const parts = key.split(this.separator)

    return parts.length >= 2 ? parts.slice(0, 2).join(this.separator) : key
  }

  public createKeyError(key: string) {
    return `Cache key "${this.keyWithoutSid(key)}" not found.`
  }

  /**
   * Creates s unique key with Bff name and session id.
   * Type is either 'attempt' or 'current'.
   * `attempt` represents the login attempt.
   * `current` represents the current login session.
   *
   * @example
   * createSessionKeyType('attempt', '1234') // attempt::{bffName}::1234
   * createSessionKeyType('current', '1234') // current::{bffName}::1234
   */
  public createSessionKeyType(type: 'attempt' | 'current', sid: string) {
    return `${type}${this.separator}${this.config.name}${this.separator}${sid}`
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
      throw new Error(
        `Failed to delete key "${this.keyWithoutSid(key)}" from cache.`,
      )
    }
  }
}
