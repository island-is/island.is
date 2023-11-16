import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import { UsersApi } from '@island.is/clients/air-discount-scheme'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Discount as TDiscount,
  NewDiscount as TNewDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import { NewDiscount as DiscountModel } from '../models/newDiscount.model'

@Injectable()
export class NewDiscountService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private usersApi: UsersApi,
  ) {}

  handleError(error: FetchError | ApolloError): void {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  discountIsValid(discount: TDiscount): boolean {
    const TWO_HOURS = '7200'
    if (JSON.stringify(discount.expiresIn) < TWO_HOURS) {
      return false
    }

    const { total } = discount.user.fund
    return total >= 1
  }

  processDiscount(discount: TDiscount): TDiscount {
    if (!this.discountIsValid(discount)) {
      discount.discountCode = null
    }
    return discount
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
    return this.usersApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getCurrentDiscount(auth: User): Promise<DiscountModel | null> {
    const discount: TNewDiscount | null = await this.getDiscount(
      auth,
      auth.nationalId,
    )
    if (!discount) {
      return null
    }
    return {
      ...discount,
      user: { ...discount.user, name: discount.user.firstName },
    }
  }

  async getCurrentDiscounts(auth: User): Promise<DiscountModel[]> {
    const relations: TUser[] = await this.getUserRelations(auth)
    const discounts: DiscountModel[] = []
    for (const relation of relations) {
      const discount: TNewDiscount | null = await this.getDiscount(
        auth,
        relation.nationalId,
      )
      if (discount) {
        // this.processDiscount(discount)
        discounts.push({
          ...discount,
          user: {
            ...relation,
            name: relation.firstName,
            fund: discount.user.fund,
          },
        })
      }
    }
    return discounts
  }

  private async getDiscount(
    auth: User,
    nationalId: string,
  ): Promise<TNewDiscount | null> {
    const discountResponse = await this.getADSWithAuth(auth)
      .privateNewDiscountControllerGetCurrentDiscountByNationalId({
        nationalId,
      })
      .catch((e) => {
        this.handleJSONError(e)
        return null
      })
    return discountResponse
  }

  private async createDiscount(
    auth: User,
    nationalId: string,
    origin: string,
    destination: string,
    isRoundTrip: boolean,
  ): Promise<TNewDiscount | null> {
    const createDiscountResponse = await this.getADSWithAuth(auth)
      .privateNewDiscountControllerCreateDiscountCode({
        nationalId,
        body: {
          origin,
          destination,
          isRoundTrip,
        },
      })
      .catch((e) => {
        this.handle4xx(e)
        return null
      })
    return createDiscountResponse
  }

  private async getUserRelations(auth: User): Promise<TUser[]> {
    const getRelationsResponse = await this.getADSWithAuth(auth)
      .privateUserControllerGetUserRelations({ nationalId: auth.nationalId })
      .catch((e) => {
        this.handle4xx(e)
      })

    if (!getRelationsResponse) {
      return []
    }

    return getRelationsResponse
  }
}
