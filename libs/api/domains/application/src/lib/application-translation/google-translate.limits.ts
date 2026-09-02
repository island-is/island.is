import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

/** Matches the admin workspace batch size and stays under Google Translate v2's 128-string cap. */
export const GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST = 100

/** Google Translate v2 per-string limit. */
export const GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT = 5_000

/** Google Translate v2 recommended/max characters per request. */
export const GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST = 30_000

export const GOOGLE_TRANSLATE_RATE_LIMIT_WINDOW_MS = 60_000
export const GOOGLE_TRANSLATE_MAX_REQUESTS_PER_WINDOW = 20
export const GOOGLE_TRANSLATE_MAX_CHARS_PER_WINDOW = 60_000

/** Shared across replicas. Caps total Google Translate spend per UTC day. */
export const GOOGLE_TRANSLATE_MAX_REQUESTS_PER_DAY = 2_000
export const GOOGLE_TRANSLATE_MAX_CHARS_PER_DAY = 2_000_000

export const GOOGLE_TRANSLATE_USAGE_KEY_PREFIX = 'google-translate:rl:'
export const GOOGLE_TRANSLATE_DAILY_KEY_PREFIX = 'google-translate:daily:'

export type WindowUsage = {
  windowStartedAt: number
  requestCount: number
  characterCount: number
}

export type DailyUsage = {
  requestCount: number
  characterCount: number
}

export type GoogleTranslateUsageStore = {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T, ttlMs: number): Promise<void>
}

export const createGoogleTranslateCacheStore = (cache: {
  get<T>(key: string): Promise<T | null | undefined>
  set<T>(key: string, value: T, ttl?: number): Promise<unknown>
}): GoogleTranslateUsageStore => ({
  get: async <T>(key: string) => (await cache.get<T>(key)) ?? undefined,
  set: async (key, value, ttlMs) => {
    await cache.set(key, value, ttlMs)
  },
})

export const googleTranslateUserUsageKey = (userKey: string): string =>
  `${GOOGLE_TRANSLATE_USAGE_KEY_PREFIX}${userKey}`

export const googleTranslateDailyUsageKey = (day: string): string =>
  `${GOOGLE_TRANSLATE_DAILY_KEY_PREFIX}${day}`

export const utcDateKey = (nowMs: number): string =>
  new Date(nowMs).toISOString().slice(0, 10)

export const msUntilNextUtcDay = (nowMs: number): number => {
  const now = new Date(nowMs)
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  )
  return Math.max(next - nowMs, 1)
}

export const totalTranslateCharacterCount = (texts: string[]): number =>
  texts.reduce(
    (sum, text) => sum + (typeof text === 'string' ? text.length : 0),
    0,
  )

export const assertGoogleTranslateInputLimits = (texts: string[]): number => {
  if (!Array.isArray(texts)) {
    throw new BadRequestException('texts must be an array of strings')
  }

  if (texts.length > GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST) {
    throw new BadRequestException(
      `At most ${GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST} texts can be translated per request`,
    )
  }

  for (const text of texts) {
    if (typeof text !== 'string') {
      throw new BadRequestException('Each text must be a string')
    }

    if (text.length > GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT) {
      throw new BadRequestException(
        `Each text must be at most ${GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT} characters`,
      )
    }
  }

  const totalChars = totalTranslateCharacterCount(texts)

  if (totalChars > GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST) {
    throw new BadRequestException(
      `At most ${GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST} characters can be translated per request`,
    )
  }

  return totalChars
}

const rateLimitExceeded = () =>
  new HttpException(
    'Google Translate rate limit exceeded. Try again later.',
    HttpStatus.TOO_MANY_REQUESTS,
  )

export class GoogleTranslateRateLimiter {
  private readonly usageByUser = new Map<string, WindowUsage>()
  private readonly dailyUsage = new Map<string, DailyUsage>()

  constructor(
    private readonly now: () => number = Date.now,
    private readonly windowMs = GOOGLE_TRANSLATE_RATE_LIMIT_WINDOW_MS,
    private readonly maxRequests = GOOGLE_TRANSLATE_MAX_REQUESTS_PER_WINDOW,
    private readonly maxChars = GOOGLE_TRANSLATE_MAX_CHARS_PER_WINDOW,
    private readonly store?: GoogleTranslateUsageStore,
    private readonly maxDailyRequests = GOOGLE_TRANSLATE_MAX_REQUESTS_PER_DAY,
    private readonly maxDailyChars = GOOGLE_TRANSLATE_MAX_CHARS_PER_DAY,
  ) {}

  async consume(userKey: string, characterCount: number): Promise<void> {
    const now = this.now()
    this.prune(now)

    const userKeyName = googleTranslateUserUsageKey(userKey)
    const current = await this.readUsage<WindowUsage>(
      userKeyName,
      this.usageByUser.get(userKey),
    )
    const usage: WindowUsage =
      !current || now - current.windowStartedAt >= this.windowMs
        ? { windowStartedAt: now, requestCount: 0, characterCount: 0 }
        : current

    if (
      usage.requestCount + 1 > this.maxRequests ||
      usage.characterCount + characterCount > this.maxChars
    ) {
      throw rateLimitExceeded()
    }

    const day = utcDateKey(now)
    const dailyKey = googleTranslateDailyUsageKey(day)
    const dailyCurrent = await this.readUsage<DailyUsage>(
      dailyKey,
      this.dailyUsage.get(day),
    )
    const daily: DailyUsage = dailyCurrent ?? {
      requestCount: 0,
      characterCount: 0,
    }

    if (
      daily.requestCount + 1 > this.maxDailyRequests ||
      daily.characterCount + characterCount > this.maxDailyChars
    ) {
      throw rateLimitExceeded()
    }

    usage.requestCount += 1
    usage.characterCount += characterCount
    daily.requestCount += 1
    daily.characterCount += characterCount

    const windowTtl = Math.max(this.windowMs - (now - usage.windowStartedAt), 1)
    await this.writeUsage(userKeyName, usage, windowTtl, (value) => {
      this.usageByUser.set(userKey, value)
    })
    await this.writeUsage(dailyKey, daily, msUntilNextUtcDay(now), (value) => {
      this.dailyUsage.set(day, value)
    })
  }

  private async readUsage<T>(
    key: string,
    fallback: T | undefined,
  ): Promise<T | undefined> {
    if (!this.store) {
      return fallback
    }

    try {
      return (await this.store.get<T>(key)) ?? fallback
    } catch {
      return fallback
    }
  }

  private async writeUsage<T>(
    key: string,
    value: T,
    ttlMs: number,
    writeLocal: (value: T) => void,
  ): Promise<void> {
    writeLocal(value)

    if (!this.store) {
      return
    }

    try {
      await this.store.set(key, value, ttlMs)
    } catch {
      // Shared store is best-effort; local write still applies on this replica.
    }
  }

  private prune(now: number): void {
    if (this.usageByUser.size >= 500) {
      for (const [key, usage] of this.usageByUser) {
        if (now - usage.windowStartedAt >= this.windowMs) {
          this.usageByUser.delete(key)
        }
      }
    }

    const today = utcDateKey(now)
    for (const day of this.dailyUsage.keys()) {
      if (day !== today) {
        this.dailyUsage.delete(day)
      }
    }
  }
}

export function MaxTotalChars(
  max: number,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'maxTotalChars',
      target: object.constructor,
      propertyName,
      constraints: [max],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (!Array.isArray(value)) {
            return false
          }

          return totalTranslateCharacterCount(value as string[]) <= max
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not exceed ${args.constraints[0]} total characters`
        },
      },
    })
  }
}
