import { KeyvAdapter } from '@apollo/utils.keyvadapter'
import KeyvRedis from '@keyv/redis'
import { createCache as createCacheManager } from 'cache-manager'
import type { CreateCacheOptions } from 'cache-manager'
import {
  Cluster,
  ClusterNode,
  RedisOptions,
  ClusterOptions,
  Redis,
} from 'ioredis'

import { logger } from '@island.is/logging'
import Keyv from 'keyv'

type Options = {
  name: string
  nodes: string[]
  ssl: boolean
  noPrefix?: boolean
}

type RedisClient = Cluster | Redis

const DEFAULT_PORT = 6379

class Cache {
  private client: Cluster

  constructor(client: Cluster) {
    this.client = client
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  set(key: string, value: string): Promise<string | null> {
    return this.client.set(key, value)
  }

  setKeyIfNotExists(
    key: string,
    field: string,
    value: string,
  ): Promise<number> {
    return this.client.hsetnx(key, field, value)
  }

  setKey(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value)
  }

  getKey(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field)
  }

  getMap(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key)
  }

  expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds)
  }

  async ping(): Promise<boolean> {
    return (await this.client.ping()) === 'PONG'
  }
}

const parseNodes = (nodes: string[]): ClusterNode[] =>
  nodes
    .filter((url) => url)
    .map((url) => {
      const [host, port] = url.split(':')
      return {
        host,
        port: parseInt(port, 10) || DEFAULT_PORT,
      }
    })

const getEnvValueToNumber = <T extends number | undefined = undefined>(
  key: string,
  defaultValue: T = undefined as unknown as T,
): number | typeof defaultValue => {
  const envValue = process.env[key]
  if (envValue) {
    const numberValue = parseInt(envValue, 10)
    if (Number.isNaN(numberValue)) {
      logger.error(`Failed parsing key ${key} with value ${envValue}`)
      return defaultValue
    }
    return numberValue
  }
  return defaultValue
}

const getRedisClusterOptions = (
  options: Options,
): RedisOptions | ClusterOptions => {
  const redisOptions: RedisOptions = {}
  if (options.ssl) {
    redisOptions['tls'] = {}
  }
  return {
    keyPrefix: options.noPrefix ? undefined : `${options.name}:`,
    slotsRefreshTimeout: getEnvValueToNumber(
      'REDIS_SLOTS_REFRESH_TIMEOUT',
      10000,
    ),
    slotsRefreshInterval: getEnvValueToNumber(
      'REDIS_SLOTS_REFRESH_INTERVAL',
      15000,
    ),
    connectTimeout: 5000,
    // https://www.npmjs.com/package/ioredis#special-note-aws-elasticache-clusters-with-tls
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions,
    reconnectOnError: (err) => {
      logger.error(`Reconnect on error: ${err}`)
      const targetError = 'READONLY'
      if (err.message.slice(0, targetError.length) === targetError) {
        // Only reconnect when the error starts with "READONLY"
        return true
      }
      return false
    },
    clusterRetryStrategy: (times) => {
      logger.info(`Redis Retry: ${times}`)
      if (times >= 3) {
        return undefined
      }
      const delay = Math.min(times * 50, 2000)
      return delay
    },
  }
}

export const createCache = (options: Options) =>
  new Cache(createRedisCluster(options))

export const createRedisApolloCache = (options: Options) => {
  return new KeyvAdapter(
    new Keyv({
      store: new KeyvRedis(createRedisCluster(options) as any, {
        useRedisSets: false,
      }),
    }) as any,
    {
      disableBatchReads: true,
    },
  )
}

export const createRedisCluster = (options: Options): Cluster => {
  const nodes = parseNodes(options.nodes)
  logger.info(`Making caching connection with nodes: `, nodes)
  return new Cluster(nodes, getRedisClusterOptions(options))
}

/**
 * Creates a cache-manager (v6) cache backed by the Redis cluster.
 *
 * Note: cache-manager v6 is Keyv-based. Keys get a Keyv namespace prefix, so
 * existing cache entries from the v5/ioredis-store era are simply cold after
 * upgrade — safe for caches, but do not use this for durable storage.
 *
 * Kept async for backwards compatibility with the v5 `caching()` signature.
 */
export const createRedisCacheManager = async (
  options: Options & { ttl?: number },
) => {
  return createCacheManager({
    // Cast because the repo hoists two structurally-identical keyv versions
    // (top-level vs. the one bundled under cache-manager); they only differ by
    // a private type field, so the Keyv instance is runtime-compatible.
    stores: [
      createRedisKeyv(options),
    ] as unknown as CreateCacheOptions['stores'],
    // v5 treated ttl: 0 as "no expiry"; v6/Keyv expects undefined for that.
    ttl: options.ttl || undefined,
  })
}

export const createRedisKeyv = (options: Options) =>
  new Keyv({
    store: new KeyvRedis(createRedisCluster(options) as any, {
      useRedisSets: false,
    }),
  })
