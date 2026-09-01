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

type WindowUsage = {
  windowStartedAt: number
  requestCount: number
  characterCount: number
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

export class GoogleTranslateRateLimiter {
  private readonly usageByUser = new Map<string, WindowUsage>()

  constructor(
    private readonly now: () => number = Date.now,
    private readonly windowMs = GOOGLE_TRANSLATE_RATE_LIMIT_WINDOW_MS,
    private readonly maxRequests = GOOGLE_TRANSLATE_MAX_REQUESTS_PER_WINDOW,
    private readonly maxChars = GOOGLE_TRANSLATE_MAX_CHARS_PER_WINDOW,
  ) {}

  consume(userKey: string, characterCount: number): void {
    const now = this.now()
    this.prune(now)

    const current = this.usageByUser.get(userKey)
    const usage =
      !current || now - current.windowStartedAt >= this.windowMs
        ? { windowStartedAt: now, requestCount: 0, characterCount: 0 }
        : current

    if (
      usage.requestCount + 1 > this.maxRequests ||
      usage.characterCount + characterCount > this.maxChars
    ) {
      throw new HttpException(
        'Google Translate rate limit exceeded. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    usage.requestCount += 1
    usage.characterCount += characterCount
    this.usageByUser.set(userKey, usage)
  }

  private prune(now: number): void {
    if (this.usageByUser.size < 500) {
      return
    }

    for (const [key, usage] of this.usageByUser) {
      if (now - usage.windowStartedAt >= this.windowMs) {
        this.usageByUser.delete(key)
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
