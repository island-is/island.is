import { TypesApi } from '@island.is/clients/consultation-portal'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { AllTypesResult } from '../models/allTypesResult.model'
import type { Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'

@Injectable()
export class TypesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private typesApi: TypesApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'types_service',
    }
    this.logger.error(errorDetail || 'Types Service Error', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  async getAllTypes(): Promise<AllTypesResult> {
    const response = await this.typesApi
      .apiTypesGet()
      .catch((e) => this.handle4xx(e, 'failed to get types'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }
}
