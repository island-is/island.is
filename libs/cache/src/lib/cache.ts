import { RedisCache } from 'apollo-server-cache-redis'

import { logger } from '@island.is/logging'

type Options = {
  host: string
  port: number
  password: string
  name: string
}

export const createCache = (options: Options) =>
  new RedisCache({
    ...options,
    connectTimeout: 5000,
    socket_keepalive: false,
    reconnectOnError: (err) => {
      logger.error(`Reconnect on error: ${err}`)
      const targetError = 'READONLY'
      if (err.message.slice(0, targetError.length) === targetError) {
        // Only reconnect when the error starts with "READONLY"
        return true
      }
    },
    retryStrategy: (times) => {
      logger.info(`Redis Retry: ${times}`)
      if (times >= 3) {
        return undefined
      }
      const delay = Math.min(times * 50, 2000)
      return delay
    },
  })
