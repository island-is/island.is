import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  ApiServicesFasteignFasteignanumerGetRequest,
  ServicesApi,
} from '@island.is/clients/form-system'
import { List, Translation } from '../../models/services.model'
import { GetPropertyInput, GetTranslationInput } from '../../dto/services.input'
import { handle4xx } from '../../utils/errorHandler'

@Injectable()
export class FormSystemService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private servicesApi: ServicesApi,
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'services-service',
    }
    this.logger.error(errorDetail || 'Error in services service', err)

    throw new ApolloError(error.message)
  }

  private servicesApiWithAuth(auth: User) {
    return this.servicesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCountries(auth: User): Promise<List> {
    const response = await this.servicesApiWithAuth(auth)
      .apiServicesLondGet()
      .catch((e) => handle4xx(e, this.handleError, 'failed to get countries'))

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as List
  }

  async getZipCodes(auth: User): Promise<List> {
    const response = await this.servicesApiWithAuth(auth)
      .apiServicesPostnumerGet()
      .catch((e) => handle4xx(e, this.handleError, 'failed to get zip codes'))

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as List
  }

  async getMunicipalities(auth: User): Promise<List> {
    const response = await this.servicesApiWithAuth(auth)
      .apiServicesSveitarfelogGet()
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get municipalities'),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as List
  }

  async getRegistrationCategories(auth: User): Promise<List> {
    const response = await this.servicesApiWithAuth(auth)
      .apiServicesSkraningarflokkarGet()
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get registration categories'),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as List
  }

  async getTradesProfessions(auth: User): Promise<List> {
    const response = await this.servicesApiWithAuth(auth)
      .apiServicesIdngreinarMeistaraGet()
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get trades professions'),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as List
  }

  async getProperty(auth: User, input: GetPropertyInput): Promise<List> {
    const request: ApiServicesFasteignFasteignanumerGetRequest = {
      fasteignanumer: input.propertyId,
    }
    const response = await this.servicesApiWithAuth(auth)
      .apiServicesFasteignFasteignanumerGet(request)
      .catch((e) => handle4xx(e, this.handleError, 'failed to get property'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as List
  }

  async getTranslation(
    input: GetTranslationInput,
  ): Promise<Translation> {
    const { FORM_SYSTEM_MIDEIND_KEY } = process.env
    const response = await fetch('https://api.greynir.is/translate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Key': FORM_SYSTEM_MIDEIND_KEY || '',
      },
      body: JSON.stringify({
        contents: input.contents,
        sourceLanguageCode: 'is',
        targetLanguageCode: 'en',
        model: '',
        domain: '',
      }),
    })
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
  }
}
