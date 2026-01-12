import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'
import { User } from '@island.is/auth-nest-tools'
import { GoogleTranslation } from '@island.is/form-system/shared'
import { handle4xx } from '../../utils/errorHandler'
import { GoogleTranslationInput } from '../../dto/translations.input'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Injectable()
export class TranslationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'services-service',
    }
    this.logger.error(errorDetail || 'Error in services service', err)

    throw new ApolloError(error.message)
  }

  async getGoogleTranslation(
    auth: User,
    input: GoogleTranslationInput,
  ): Promise<GoogleTranslation> {
    const apiKey = process.env.FORM_SYSTEM_GOOGLE_TRANSLATE_API_KEY as string

    if (!apiKey) {
      throw new Error(
        'Api key for Google translation service is not configured',
      )
    }

    // Use createEnhancedFetch to get a fetch function
    const enhancedFetch = createEnhancedFetch({
      name: 'form-system-translations',
      organizationSlug: 'stafraent-island',
      timeout: 20000,
      logErrorResponseBody: true,
    })

    try {
      const response = await enhancedFetch(
        `https://translation.googleapis.com/language/translate/v2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            q: input.q,
            source: 'is',
            target: 'en',
            format: 'text',
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Google translation with status: ${response.status}`,
        )
      }

      const result = await response.json()
      return {
        translation: result?.data?.translations?.[0]?.translatedText || '',
      } as GoogleTranslation
    } catch (error) {
      handle4xx(error, this.handleError, 'failed to get Google translation')
      throw new Error('Unexpected error in translation service')
    }
  }
}
