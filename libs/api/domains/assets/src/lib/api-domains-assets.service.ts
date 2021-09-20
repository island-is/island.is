import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FasteignirApi } from '@island.is/clients/assets'
import type { AssetsXRoadConfig } from './api-domains-assets.module'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

const getAssetString = (str: string) =>
  str.charAt(0).toLowerCase() === 'f' ? str.substring(1) : str

@Injectable()
export class AssetsXRoadService {
  constructor(
    // @Inject('Config')
    // private config: AssetsXRoadConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private FasteignirApi: FasteignirApi,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  private getRealEstatesWithAuth(auth: Auth) {
    return this.FasteignirApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getRealEstates(auth: User): Promise<any> {
    const fasteignirResponse = await this.getRealEstatesWithAuth(
      auth,
    ).fasteignirGetFasteignir({ kennitala: auth.nationalId })

    if (fasteignirResponse) {
      return fasteignirResponse
    }

    throw new Error('Could not fetch fasteignir')
  }

  async getRealEstateDetail(assetId: string, auth: User): Promise<any | null> {
    const singleFasteignResponse = (await this.getRealEstatesWithAuth(
      auth,
    ).fasteignirGetFasteign({ fasteignanumer: getAssetString(assetId) })) as any

    if (singleFasteignResponse) {
      return singleFasteignResponse
    }

    throw new Error('Could not fetch fasteignir')
  }

  async getThinglystirEigendur(
    assetId: string,
    auth: User,
    cursor?: string | null,
    limit?: number | null,
  ): Promise<any | null> {
    const singleFasteignResponse = (await this.getRealEstatesWithAuth(
      auth,
    ).fasteignirGetFasteignEigendur({
      fasteignanumer: assetId,
      cursor: cursor,
      limit: limit,
    })) as any

    if (singleFasteignResponse) {
      return singleFasteignResponse
    }

    throw new Error('Could not fetch fasteignir')
  }
}
