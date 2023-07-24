import { Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'

import { Configuration, DefaultApi } from '../../gen/fetch'
import { GetLegalEntityRelationshipsResult } from '../types/GetLegalEntityRelationshipsResult'
import { GetIndividualRelationships } from '../types/GetIndividualRelationships'

@Injectable()
export class RskRelationshipsClient {
  private defaultApi: DefaultApi
  private configuration: Configuration

  constructor(config: Configuration) {
    this.defaultApi = new DefaultApi(config)
    this.configuration = config
  }

  defaultApiWithAuth(auth: Auth) {
    return this.defaultApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDefaultRequestHeaders(user: User) {
    return {
      xRoadClient: this.configuration.headers?.['X-Road-Client'] ?? '',
      authorization: user.authorization,
    }
  }

  /**
   * Gets individual and associated relationships
   */
  async getIndividualRelationships(
    user: User,
  ): Promise<GetIndividualRelationships | null> {
    const individual = await this.defaultApiWithAuth(user)
      .meLookup({
        ...this.getDefaultRequestHeaders(user),
      })
      .catch(this.handle404)

    if (!individual) {
      return null
    }

    return {
      ...individual,
      relationships:
        individual?.relationships?.map(({ name, nationalId, type }) => ({
          name,
          nationalId,
          type,
        })) ?? [],
    }
  }

  /**
   * Get legal entity relationships by national id
   */
  async getLegalEntityRelationships(
    user: User,
    nationalId: string,
  ): Promise<GetLegalEntityRelationshipsResult | null> {
    const legalEntity = await this.defaultApiWithAuth(user)
      .legalEntityLookup({
        ...this.getDefaultRequestHeaders(user),
        xParamNationalId: nationalId,
      })
      .catch(this.handle404)

    if (!legalEntity) {
      return null
    }

    return {
      name: legalEntity.name,
      nationalId: legalEntity.nationalId,
      relationships:
        legalEntity.relationships?.map(({ name, nationalId, type }) => ({
          name,
          nationalId,
          type,
        })) ?? [],
    }
  }

  private handle404(error: FetchError): null {
    if (error.name === 'FetchError' && error.status === 404) {
      return null
    }

    throw error
  }
}
