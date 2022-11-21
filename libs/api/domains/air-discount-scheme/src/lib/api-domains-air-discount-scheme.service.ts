import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import { UsersApi as AirDiscountSchemeApi } from '@island.is/clients/air-discount-scheme'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Discount } from '@island.is/air-discount-scheme/types'
import {
  Discount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import { Discount as DiscountModel } from '../models/discount.model'
type DiscountWithTUser = DiscountModel & { user: TUser }

const TWO_HOURS = 7200
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

  private handleJSONError(e: FetchError) {
    // Couldn't generate client for Discount | null
    if (e.message.includes('invalid json')) {
      return null
    }
    this.handle4xx(e)
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

  async getCurrentDiscounts(auth: User) {
    const relations: TUser[] = (await this.getUserRelations(auth)) as TUser[]

    const discounts: DiscountWithTUser[] = []
    for (const relation of relations) {
      let discount: TDiscount = (await this.getDiscount(
        auth,
        relation.nationalId,
      )) as TDiscount
      if (!discount || discount.expiresIn <= TWO_HOURS) {
        const createdDiscount = await this.createDiscount(
          auth,
          relation.nationalId,
        )

        if (createdDiscount) {
          discount = createdDiscount
        }
      }
      discounts.push({
        ...discount,
        user: { ...relation, name: relation.firstName },
      })
    }

    return discounts
  }

  private async getDiscount(
    auth: User,
    nationalId: string,
  ): Promise<unknown | null> {
    try {
      const discountResponse = await this.getADSWithAuth(
        auth,
      ).privateDiscountControllerGetCurrentDiscountByNationalId({
        nationalId,
      })

      return discountResponse
    } catch (e) {
      this.handleJSONError(e)
    }
  }

  private async createDiscount(
    auth: User,
    nationalId: string,
  ): Promise<Discount | null> {
    try {
      const createDiscountResponse = await this.getADSWithAuth(
        auth,
      ).privateDiscountControllerCreateDiscountCode({
        nationalId,
      })
      return createDiscountResponse
    } catch (e) {
      this.handle4xx(e)
      return null
    }
  }

  private async getUserRelations(auth: User): Promise<TUser[] | null> {
    try {
      let getRelationsResponse = await this.getADSWithAuth(
        auth,
      ).privateUserControllerGetUserRelations({ nationalId: auth.nationalId })

      // Should not generate discountcodes for users who do not meet requirements
      getRelationsResponse = getRelationsResponse.filter(
        (user) => user.fund.credit === user.fund.total - user.fund.used,
      )

      return getRelationsResponse
    } catch (e) {
      this.handle4xx(e)
      return null
    }
  }
}
