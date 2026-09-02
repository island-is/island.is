import { Inject, Injectable, Optional } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache as CacheManager } from 'cache-manager'
import type { User } from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

import {
  assertGoogleTranslateInputLimits,
  createGoogleTranslateCacheStore,
  GOOGLE_TRANSLATE_MAX_CHARS_PER_WINDOW,
  GOOGLE_TRANSLATE_MAX_REQUESTS_PER_WINDOW,
  GOOGLE_TRANSLATE_RATE_LIMIT_WINDOW_MS,
  GoogleTranslateRateLimiter,
} from './google-translate.limits'

@Injectable()
export class GoogleTranslateService {
  private readonly enhancedFetch = createEnhancedFetch({
    name: 'application-translation-google-translate',
    organizationSlug: 'stafraent-island',
    timeout: 20000,
    logErrorResponseBody: true,
  })
  private readonly rateLimiter: GoogleTranslateRateLimiter

  constructor(
    @Optional()
    @Inject(CACHE_MANAGER)
    cacheManager?: CacheManager,
  ) {
    this.rateLimiter = new GoogleTranslateRateLimiter(
      Date.now,
      GOOGLE_TRANSLATE_RATE_LIMIT_WINDOW_MS,
      GOOGLE_TRANSLATE_MAX_REQUESTS_PER_WINDOW,
      GOOGLE_TRANSLATE_MAX_CHARS_PER_WINDOW,
      cacheManager ? createGoogleTranslateCacheStore(cacheManager) : undefined,
    )
  }

  async translateTexts(user: User, texts: string[]): Promise<string[]> {
    if (texts.length === 0) {
      return []
    }

    const totalChars = assertGoogleTranslateInputLimits(texts)
    await this.rateLimiter.consume(user.nationalId, totalChars)

    const apiKey = process.env.FORM_SYSTEM_GOOGLE_TRANSLATE_API_KEY

    if (!apiKey) {
      logger.warn(
        'FORM_SYSTEM_GOOGLE_TRANSLATE_API_KEY not configured, returning empty translations',
      )
      return texts.map(() => '')
    }

    try {
      const response = await this.enhancedFetch(
        'https://translation.googleapis.com/language/translate/v2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            q: texts,
            source: 'is',
            target: 'en',
            format: 'text',
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Google Translate API returned status ${response.status}`,
        )
      }

      const result = await response.json()
      const translations: { translatedText: string }[] =
        result?.data?.translations ?? []

      return texts.map((_, i) => translations[i]?.translatedText ?? '')
    } catch (error) {
      logger.error('Google Translate failed', error)
      throw new Error('Failed to translate texts with Google Translate')
    }
  }
}
