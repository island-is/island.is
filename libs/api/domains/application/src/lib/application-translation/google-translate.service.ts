import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

import {
  assertGoogleTranslateInputLimits,
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
  private readonly rateLimiter = new GoogleTranslateRateLimiter()

  async translateTexts(user: User, texts: string[]): Promise<string[]> {
    if (texts.length === 0) {
      return []
    }

    const totalChars = assertGoogleTranslateInputLimits(texts)
    this.rateLimiter.consume(user.nationalId, totalChars)

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
