// Cannot import import type { Logger } from '@island.is/logging'
// results in `A project tagged with "scope:js" can only depend on libs tagged with "lib:js"`
interface Logger {
  error: (message: string) => void
  warn: (message: string) => void
  info: (message: string) => void
}

interface RetryConfig {
  maxRetries?: number
  retryDelayMs?: number
  shouldRetryOnError?: (error: Error) => boolean
  logPrefix?: string
  logger?: Logger
}

const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY_MS = 1000

export const retry = async <T>(
  fn: () => Promise<T>,
  config: RetryConfig = {},
) => {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  } = { ...config }

  let attempt = 0

  while (attempt < maxRetries) {
    try {
      return await fn()
    } catch (e) {
      const shouldRetry = config.shouldRetryOnError
        ? config.shouldRetryOnError(e)
        : true

      if (attempt === maxRetries - 1 || !shouldRetry) {
        config.logger?.error(
          `${
            config.logPrefix ?? 'Retry failed'
          } after ${maxRetries} attempts: ${e.message}`,
        )
        throw e
      }

      config.logger?.warn(
        `${config.logPrefix ?? 'Retry failed'} with error: ${
          e.message
        }. Retrying in ${retryDelayMs}ms
            `,
      )

      attempt++
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }
  }

  // Should never reach this point
  throw new Error(
    `Retry function ${
      config.logPrefix ? `(for ${config.logPrefix})` : ''
    } failed after ${maxRetries} attempts`,
  )
}
