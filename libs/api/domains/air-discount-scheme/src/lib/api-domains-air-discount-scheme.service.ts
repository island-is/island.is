import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import { UsersApi as AirDiscountSchemeApi } from '@island.is/clients/air-discount-scheme'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class AirDiscountSchemeService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private airDiscountSchemeApi: AirDiscountSchemeApi,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  private handle4xx(error: FetchError) {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    this.handleError(error)
  }

  private getADSWithAuth(auth: Auth) {
    return this.airDiscountSchemeApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getDiscount(auth: User, nationalId: string): Promise<unknown | null> {
    try {
      const discountResponse = await this.getADSWithAuth(
        auth,
      ).privateDiscountControllerGetCurrentDiscountByNationalId({
        nationalId,
      })

      console.log('discountResponse', JSON.stringify(discountResponse))

      return JSON.stringify(discountResponse)
    } catch (e) {
      this.handle4xx(e)
    }
  }

  async createDiscount(
    auth: User,
    nationalId: string,
  ): Promise<unknown | null> {
    try {
      const createDiscountResponse = await this.getADSWithAuth(
        auth,
      ).privateDiscountControllerCreateDiscountCode({
        nationalId,
      })
      console.log('createDiscountResponse', createDiscountResponse)
      return createDiscountResponse
    } catch (e) {
      this.handle4xx(e)
    }
  }

  async getUserRelations(auth: User): Promise<unknown | null> {
    try {
      const getRelationsResponse = await this.getADSWithAuth(
        auth,
      ).privateUserControllerGetUserRelations({ nationalId: auth.nationalId })

      console.log('getRelationResponse: ', getRelationsResponse)
      return getRelationsResponse
    } catch (e) {
      this.handle4xx(e)
    }
  }
}
