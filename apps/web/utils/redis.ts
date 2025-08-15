import type { createCache } from '@island.is/cache'

export interface RedisConfig {
  nodes: string[]
  ssl: boolean
}

export class JtiCache {
  private cache: ReturnType<typeof createCache> | null = null
  private readonly ttlSeconds = 600 // 10 minutes

  constructor(config: RedisConfig) {
    if (config.nodes.length > 0) {
      // Dynamic import to avoid lazy-loading issues
      import('@island.is/cache')
        .then(({ createCache }) => {
          this.cache = createCache({
            name: 'jti-cache',
            nodes: config.nodes,
            ssl: config.ssl,
          })
          console.log(
            `JTI cache initialized with Redis nodes: ${config.nodes.join(
              ', ',
            )}`,
          )
        })
        .catch((error) => {
          console.error('Failed to initialize Redis cache:', error)
          this.cache = null
        })
    } else {
      this.cache = null
      console.warn('No Redis nodes configured, JTI cache will be disabled')
    }
  }

  /**
   * Check if a JTI exists and store it if it doesn't
   * @param jti - The JWT ID to check
   * @returns true if this is a replay attack, false otherwise
   */
  async isReplay(jti: string): Promise<boolean> {
    if (!this.cache) {
      // Fallback to allow the request if Redis is not available
      console.warn('Redis not available, allowing JTI')
      return false
    }

    try {
      const key = `jti:${jti}`
      const exists = await this.cache.get(key)

      if (exists) {
        console.log(`Replay attack detected for JTI: ${jti}`)
        return true // JTI already exists, this is a replay
      }

      // Store JTI with expiration
      await this.cache.set(key, '1')
      await this.cache.expire(key, this.ttlSeconds)
      console.log(`JTI stored in Redis: ${jti} (TTL: ${this.ttlSeconds}s)`)

      return false
    } catch (error) {
      console.error('Error checking JTI in Redis:', error)
      // Fallback to allow the request if Redis fails
      return false
    }
  }

  /**
   * Check if Redis is available
   */
  isAvailable(): boolean {
    return this.cache !== null
  }

  /**
   * Get the TTL in seconds
   */
  getTtl(): number {
    return this.ttlSeconds
  }
}
