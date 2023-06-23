import { Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'

import { Configuration, DefaultApi } from '../../gen/fetch'
import { GetLegalEntities } from '../types/GetLegalEntities'
import { GetLegalEntity } from '../types/GetLegalEntity'
import { GetIndividualRelationships } from '../types/GetIndividualRelationships'

@Injectable()
export class RskProcuringClient {
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
      .individualLookup({
        ...this.getDefaultRequestHeaders(user),
        xParamNationalId: user.nationalId,
      })
      .catch(this.handle404)

    if (!individual) {
      return null
    }

    return {
      ...individual,
      relationships:
        individual?.relationships?.map(({ name, nationalId }) => ({
          name,
          nationalId,
        })) ?? [],
    }
  }

  /**
   * Get legal entities by search query, i.e. name or national id applies here
   */
  async getLegalEntities(
    user: User,
    search: string,
  ): Promise<GetLegalEntities> {
    const res = await this.defaultApiWithAuth(user)
      .legalEntitySearch({
        ...this.getDefaultRequestHeaders(user),
        xQuerySearch: search,
      })
      .catch(this.handle404)

    if (!res?.legalEntities) {
      return []
    }

    return res.legalEntities
      .filter(({ name, nationalId }) => name && nationalId)
      .map(({ name, nationalId }) => ({
        name: name,
        nationalId: nationalId,
      })) as GetLegalEntities
  }

  /**
   * Get legal entity by national id
   */
  async getLegalEntity(
    user: User,
    nationalId: string,
  ): Promise<GetLegalEntity | null> {
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
        legalEntity.relationships?.map(({ name, nationalId }) => ({
          name,
          nationalId,
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
