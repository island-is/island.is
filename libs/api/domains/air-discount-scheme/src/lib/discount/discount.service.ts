import { Inject, Injectable } from '@nestjs/common'

import { Discount as TDiscount } from '@island.is/air-discount-scheme/types'
import type { User } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeClientService } from '@island.is/clients/air-discount-scheme'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Discount as DiscountModel } from '../models/discount.model'
import { handleError } from '../shared/handleError'

@Injectable()
export class DiscountService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly airDiscountSchemeClientService: AirDiscountSchemeClientService,
  ) {}

  discountIsValid(discount: TDiscount): boolean {
    const TWO_HOURS = 7200
    if (discount.expiresIn <= TWO_HOURS) {
      return false
    }

    const { credit } = discount.user.fund
    return credit >= 1
  }

  processDiscount(discount: TDiscount): TDiscount {
    if (!this.discountIsValid(discount)) {
      discount.discountCode = null
    }
    return discount
  }

  async getCurrentDiscounts(auth: User): Promise<DiscountModel[]> {
    try {
      const relations =
        await this.airDiscountSchemeClientService.getUserRelations(auth)

      const discounts: DiscountModel[] = []
      for (const relation of relations) {
        const discount =
          await this.airDiscountSchemeClientService.getCurrentDiscount(
            auth,
            relation.nationalId,
          )

        if (discount) {
          this.processDiscount(discount)
          discounts.push({
            ...discount,
            user: {
              ...relation,
              name: relation.firstName,
              fund: discount.user.fund,
            },
          })
          continue
        }

        const createdDiscount =
          await this.airDiscountSchemeClientService.createDiscount(
            auth,
            relation.nationalId,
          )

        if (createdDiscount) {
          this.processDiscount(createdDiscount)
          discounts.push({
            ...createdDiscount,
            user: { ...relation, name: relation.firstName },
          })
        }
      }

      return discounts
    } catch (error) {
      return handleError(this.logger, error)
    }
  }
}
