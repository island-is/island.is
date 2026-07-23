import { KeyvAdapter } from '@apollo/utils.keyvadapter'
import KeyvRedis from '@keyv/redis'
import { createCache as createCacheManager } from 'cache-manager'
import { Cluster, ClusterNode, RedisOptions, ClusterOptions } from 'ioredis'

import { logger } from '@island.is/logging'
import Keyv from 'keyv'

type Options = {
  name: string
  nodes: string[]
  ssl: boolean
  noPrefix?: boolean
}

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
  return new KeyvAdapter(createRedisKeyv(options), {
    disableBatchReads: true,
  })
}

export const createRedisCluster = (options: Options): Cluster => {
  const nodes = parseNodes(options.nodes)
  logger.info(`Making caching connection with nodes: `, nodes)
  return new Cluster(nodes, getRedisClusterOptions(options))
}

/**
 * Creates a cache-manager cache backed by the Redis cluster.
 *
 * Keys get a Keyv namespace prefix and values are wrapped by Keyv's
 * serializer, so entries are not interoperable with clients reading or
 * writing raw Redis keys — treat this strictly as a cache, never as durable
 * storage.
 *
 * Kept async for backwards compatibility with callers that await it.
 */
export const createRedisCacheManager = async (
  options: Options & { ttl?: number },
) => {
  return createCacheManager({
    stores: [createRedisKeyv(options)],
    // Keyv expects undefined (not 0) for "no expiry".
    ttl: options.ttl || undefined,
  })
}

export const createRedisKeyv = (options: Options) => {
  const keyv = new Keyv({
    store: new KeyvRedis(createRedisCluster(options), {
      useRedisSets: false,
    }),
  })
  // Keyv converts store errors into events plus cache-miss returns; without a
  // listener a Redis outage is indistinguishable from a 100% miss rate.
  keyv.on('error', (error) =>
    logger.error(
      `Redis cache error: ${error instanceof Error ? error.message : error}`,
    ),
  )
  return keyv
}
