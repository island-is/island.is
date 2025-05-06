import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'
import { User } from '@island.is/auth-nest-tools'
import { Translation } from '../../models/services.model'
import { handle4xx } from '../../utils/errorHandler'
import { GetTranslationInput } from '../../dto/service.input'

@Injectable()
export class ServicesService {
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

  private async fetchTranslation(
    input: GetTranslationInput,
  ): Promise<Response> {
    const { FORM_SYSTEM_MIDEIND_KEY } = process.env
    if (!FORM_SYSTEM_MIDEIND_KEY) {
      throw new Error('Api key for translation service is not configured')
    }
    const response = await fetch('https://api.greynir.is/translate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Key': FORM_SYSTEM_MIDEIND_KEY,
      },
      body: JSON.stringify({
        contents: input.textToTranslate,
        sourceLanguageCode: 'is',
        targetLanguageCode: 'en',
        model: '',
        domain: '',
      }),
    })
    if (!response.ok) {
      throw new Error(
        `Failed to fetch translation with status: ${response.status}`,
      )
    }
    return response
  }

  async getTranslation(
    auth: User,
    input: GetTranslationInput,
  ): Promise<Translation> {
    try {
      const response = await this.fetchTranslation(input)
      if (!response.ok) {
        throw new Error('Failed to get translation')
      }
      const result = await response.json()
      return {
        translations: result.translations ?? [],
        sourceLanguageCode: result.sourceLanguageCode ?? '',
        targetLanguageCode: result.targetLanguageCode ?? '',
        model: result.model ?? '',
      } as Translation
    } catch (error) {
      handle4xx(error, this.handleError, 'failed to get translation')
      return error
    }
  }
}
