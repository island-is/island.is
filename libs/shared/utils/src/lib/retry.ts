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

const IS_TEST_ENV =
  typeof process !== 'undefined' &&
  process.versions?.node != null &&
  process.env.NODE_ENV === 'test'

const getJitteredDelay = (baseDelay: number) => {
  // In test environment, return 0 delay
  if (IS_TEST_ENV) {
    return 0
  }

  // Add random jitter between 0 and 25% of the base delay
  const jitter = Math.random() * (baseDelay * 0.25)
  return baseDelay + jitter
}

export const retry = async <T>(
  fn: (attempt?: number) => Promise<T>,
  config: RetryConfig = {},
) => {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  } = { ...config }

  let attempt = 0

  while (attempt < maxRetries) {
    try {
      return await fn(attempt)
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

      const jitteredDelay = getJitteredDelay(retryDelayMs)
      config.logger?.warn(
        `[retry #${attempt + 1}]: ${
          config.logPrefix ?? 'Retry failed'
        } with error: ${e.message}. Retrying in ${Math.round(jitteredDelay)}ms`,
      )

      attempt++
      await new Promise((resolve) => setTimeout(resolve, jitteredDelay))
    }
  }

  // Should never reach this point
  throw new Error(
    `Retry function ${
      config.logPrefix ? `(for ${config.logPrefix})` : ''
    } failed after ${maxRetries} attempts`,
  )
}
