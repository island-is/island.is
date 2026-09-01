import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common'

import {
  assertGoogleTranslateInputLimits,
  GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST,
  GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT,
  GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST,
  GoogleTranslateRateLimiter,
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

describe('GoogleTranslateRateLimiter', () => {
  it('allows traffic within the window and then rejects', () => {
    const limiter = new GoogleTranslateRateLimiter(() => 1_000, 60_000, 2, 100)

    limiter.consume('user-1', 40)
    limiter.consume('user-1', 40)

    expect(() => limiter.consume('user-1', 1)).toThrow(HttpException)
  })

  it('rejects when the character budget is exhausted', () => {
    const limiter = new GoogleTranslateRateLimiter(() => 1_000, 60_000, 10, 50)

    limiter.consume('user-1', 50)

    expect(() => limiter.consume('user-1', 1)).toThrow(HttpException)
    try {
      limiter.consume('user-1', 1)
    } catch (error) {
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }
  })

  it('tracks callers independently', () => {
    const limiter = new GoogleTranslateRateLimiter(() => 1_000, 60_000, 1, 50)

    limiter.consume('user-1', 10)
    expect(() => limiter.consume('user-2', 10)).not.toThrow()
  })

  it('resets after the window elapses', () => {
    let now = 1_000
    const limiter = new GoogleTranslateRateLimiter(() => now, 60_000, 1, 50)

    limiter.consume('user-1', 50)
    now += 60_000
    expect(() => limiter.consume('user-1', 50)).not.toThrow()
  })
})
