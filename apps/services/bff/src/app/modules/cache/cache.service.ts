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
   * If the key is in pattern of "{type}::{name}::{sid}" and contains a session id,
   * it will be removed from key to ensure leaking session id to logs.
   * otherwise the key will be returned as is.
   *
   * @example
   * keyWithoutSid('attempt::some_name::1234') // attempt::some_name
   *
   * @example
   * keyWithoutSid('some_name::1234') // some_name::1234
   */
  private keyWithoutSid(key: string) {
    if (key.split(this.separator).length !== 3) {
      return key
    }

    return key.split(this.separator).slice(0, 2).join(this.separator)
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
