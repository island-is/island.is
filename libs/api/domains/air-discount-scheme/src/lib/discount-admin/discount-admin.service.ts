import { Injectable } from '@nestjs/common'
import { AdminApi } from '@island.is/clients/air-discount-scheme'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { Discount } from '../models/discount.model'
import { CreateExplicitDiscountCodeInput } from './dto/createExplicitDiscountCode.input'

@Injectable()
export class DiscountAdminService {
  constructor(private adsAdminApi: AdminApi) {}

  private adsAdminApiWithAuth(auth: Auth) {
    return this.adsAdminApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createExplicitDiscountCode(
    auth: User,
    input: CreateExplicitDiscountCodeInput,
  ): Promise<Array<Discount>> {
    const discount = await this.adsAdminApiWithAuth(
      auth,
    ).privateDiscountAdminControllerCreateExplicitDiscountCode({ body: input })
    return discount.map((item) => {
      return {
        ...item,
        user: {
          ...item.user,
          name: item.user.firstName,
        },
      }
    })
  }
  async createSuperExplicitDiscountCode(
    auth: User,
    input: CreateExplicitDiscountCodeInput,
  ): Promise<Array<Discount>> {
    const discount = await this.adsAdminApiWithAuth(
      auth,
    ).privateDiscountAdminControllerCreateSuperExplicitDiscountCode({
      body: input,
    })
    return discount.map((item) => {
      return {
        ...item,
        user: {
          ...item.user,
          name: item.user.firstName,
        },
      }
    })
  }
}
