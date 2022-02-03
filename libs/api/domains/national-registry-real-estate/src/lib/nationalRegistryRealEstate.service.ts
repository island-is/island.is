import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FasteignirApi } from '@island.is/clients/national-registry-real-estate/v1'
import { FetchError } from '@island.is/clients/middlewares'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { NationalRegistryRealEstateRealEstate } from '../models/nationalRegistryRealEstateRealEstate.model'

export class NationalRegistryRealEstateService {
  constructor(
    private nationalRegistryRealEstateApi: FasteignirApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  nationalRegistryRealEstateApiWithAuth(auth: Auth) {
    return this.nationalRegistryRealEstateApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return undefined
    }
    throw error
  }

  async getRealEstates(
    user: User,
    nationalId: string,
  ): Promise<NationalRegistryRealEstateRealEstate[] | undefined> {
    const realEstate = await this.nationalRegistryRealEstateApiWithAuth(user)
      .fasteignirGetFasteignir({
        kennitala: nationalId,
        cursor: null,
        limit: null,
      })
      .catch(this.handle404)

    return realEstate?.fasteignir?.map((fasteign) => {
      return {
        realEstateNumber: fasteign.fasteignanumer,
      }
    })
  }
}
