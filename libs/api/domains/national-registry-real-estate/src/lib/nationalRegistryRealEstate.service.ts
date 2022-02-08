import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FasteignirApi } from '@island.is/clients/national-registry-real-estate/v1'
import { FetchError } from '@island.is/clients/middlewares'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { NationalRegistryRealEstate } from '../models/nationalRegistryRealEstate.model'

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

  async getMyRealEstates(
    user: User,
  ): Promise<NationalRegistryRealEstate[] | undefined> {
    const result = await this.nationalRegistryRealEstateApiWithAuth(user)
      .fasteignirGetFasteignir({
        kennitala: user.nationalId,
        cursor: null,
        limit: null,
      })
      .catch(this.handle404)

    return result?.fasteignir?.map((fasteign) => {
      return {
        realEstateNumber: fasteign.fasteignanumer,
      }
    })
  }

  async getRealEstateByNumber(
    user: User,
    realEstateNumber: string,
  ): Promise<NationalRegistryRealEstate | undefined> {
    const result = await this.nationalRegistryRealEstateApiWithAuth(user)
      .fasteignirGetFasteign({
        fasteignanumer: realEstateNumber,
      })
      .catch(this.handle404)

    return (
      result && {
        realEstateNumber: result.fasteignanumer,
        defaultAddress: result.sjalfgefidStadfang && {
          streetName: result.sjalfgefidStadfang.birting,
          postalCode: result.sjalfgefidStadfang.postnumer,
          city: result.sjalfgefidStadfang.sveitarfelagBirting,
        },
      }
    )
  }
}
