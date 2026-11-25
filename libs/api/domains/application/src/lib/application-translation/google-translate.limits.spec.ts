import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common'

import {
  assertGoogleTranslateInputLimits,
  createGoogleTranslateCacheStore,
  GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST,
  GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT,
  GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST,
  googleTranslateDailyUsageKey,
  googleTranslateUserUsageKey,
  GoogleTranslateRateLimiter,
  type DailyUsage,
  type GoogleTranslateUsageStore,
  type WindowUsage,
} from './google-translate.limits'

describe('assertGoogleTranslateInputLimits', () => {
  it('accepts an empty list', () => {
    expect(assertGoogleTranslateInputLimits([])).toBe(0)
  })

  it('accepts a batch at the item and character caps', () => {
    const texts = Array.from({ length: 6 }, () =>
      'a'.repeat(GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST / 6),
    )

    expect(assertGoogleTranslateInputLimits(texts)).toBe(
      GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST,
    )
  })

  it('rejects more texts than the per-request cap', () => {
    const texts = Array.from(
      { length: GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST + 1 },
      () => 'ok',
    )

    expect(() => assertGoogleTranslateInputLimits(texts)).toThrow(
      BadRequestException,
    )
  })

  it('rejects a single text over the per-string cap', () => {
    const texts = ['a'.repeat(GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT + 1)]

    expect(() => assertGoogleTranslateInputLimits(texts)).toThrow(
      BadRequestException,
    )
  })

  it('rejects a batch over the total character cap', () => {
    const texts = Array.from({ length: 10 }, () =>
      'a'.repeat(GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST / 9),
    )

    expect(() => assertGoogleTranslateInputLimits(texts)).toThrow(
      BadRequestException,
    )
  })
})

const memoryStore = (): GoogleTranslateUsageStore => {
  const values = new Map<string, unknown>()
  return {
    get: async <T>(key: string) => values.get(key) as T | undefined,
    set: async (key, value) => {
      values.set(key, value)
    },
  }
}

describe('GoogleTranslateRateLimiter', () => {
  it('allows traffic within the window and then rejects', async () => {
    const limiter = new GoogleTranslateRateLimiter(() => 1_000, 60_000, 2, 100)

    await limiter.consume('user-1', 40)
    await limiter.consume('user-1', 40)

    await expect(limiter.consume('user-1', 1)).rejects.toBeInstanceOf(
      HttpException,
    )
  })

  it('rejects when the character budget is exhausted', async () => {
    const limiter = new GoogleTranslateRateLimiter(() => 1_000, 60_000, 10, 50)

    await limiter.consume('user-1', 50)

    await expect(limiter.consume('user-1', 1)).rejects.toBeInstanceOf(
      HttpException,
    )
    try {
      await limiter.consume('user-1', 1)
    } catch (error) {
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }
  })

  it('tracks callers independently', async () => {
    const limiter = new GoogleTranslateRateLimiter(() => 1_000, 60_000, 1, 50)

    await limiter.consume('user-1', 10)
    await expect(limiter.consume('user-2', 10)).resolves.toBeUndefined()
  })

  it('resets after the window elapses', async () => {
    let now = 1_000
    const limiter = new GoogleTranslateRateLimiter(() => now, 60_000, 1, 50)

    await limiter.consume('user-1', 50)
    now += 60_000
    await expect(limiter.consume('user-1', 50)).resolves.toBeUndefined()
  })

  it('shares the per-user budget across limiter instances via the store', async () => {
    const store = memoryStore()
    const replicaA = new GoogleTranslateRateLimiter(
      () => 1_000,
      60_000,
      2,
      100,
      store,
    )
    const replicaB = new GoogleTranslateRateLimiter(
      () => 1_000,
      60_000,
      2,
      100,
      store,
    )

    await replicaA.consume('user-1', 40)
    await replicaB.consume('user-1', 40)

    await expect(replicaA.consume('user-1', 1)).rejects.toBeInstanceOf(
      HttpException,
    )

    const usage = await store.get<WindowUsage>(
      googleTranslateUserUsageKey('user-1'),
    )
    expect(usage?.requestCount).toBe(2)
    expect(usage?.characterCount).toBe(80)
  })

  it('enforces a shared daily ceiling across users', async () => {
    const store = memoryStore()
    const limiter = new GoogleTranslateRateLimiter(
      () => Date.UTC(2026, 8, 2, 12),
      60_000,
      20,
      10_000,
      store,
      2,
      1_000,
    )

    await limiter.consume('user-1', 100)
    await limiter.consume('user-2', 100)

    await expect(limiter.consume('user-3', 1)).rejects.toBeInstanceOf(
      HttpException,
    )

    const daily = await store.get<DailyUsage>(
      googleTranslateDailyUsageKey('2026-09-02'),
    )
    expect(daily?.requestCount).toBe(2)
  })

  it('serializes concurrent consumes so the window cap cannot be bypassed', async () => {
    const limiter = new GoogleTranslateRateLimiter(() => 1_000, 60_000, 2, 100)

    const results = await Promise.allSettled([
      limiter.consume('user-1', 10),
      limiter.consume('user-1', 10),
      limiter.consume('user-1', 10),
    ])

    const fulfilled = results.filter((result) => result.status === 'fulfilled')
    const rejected = results.filter((result) => result.status === 'rejected')

    expect(fulfilled).toHaveLength(2)
    expect(rejected).toHaveLength(1)
  })

  it('keeps counting locally when the shared store accepts reads but rejects writes', async () => {
    const frozen: WindowUsage = {
      windowStartedAt: 1_000,
      requestCount: 1,
      characterCount: 10,
    }
    const store: GoogleTranslateUsageStore = {
      get: async () => frozen as never,
      set: async () => {
        throw new Error('read-only replica')
      },
    }
    const limiter = new GoogleTranslateRateLimiter(
      () => 1_000,
      60_000,
      3,
      100,
      store,
    )

    await limiter.consume('user-1', 10)
    await limiter.consume('user-1', 10)
    await expect(limiter.consume('user-1', 10)).rejects.toBeInstanceOf(
      HttpException,
    )
  })
})

describe('createGoogleTranslateCacheStore', () => {
  it('adapts cache-manager get/set with ttl', async () => {
    const cache = {
      get: jest.fn().mockResolvedValue({ requestCount: 1 }),
      set: jest.fn().mockResolvedValue(undefined),
    }
    const store = createGoogleTranslateCacheStore(cache)

    await expect(store.get('k')).resolves.toEqual({ requestCount: 1 })
    await store.set('k', { requestCount: 2 }, 1_000)
    expect(cache.set).toHaveBeenCalledWith('k', { requestCount: 2 }, 1_000)
  })
})
