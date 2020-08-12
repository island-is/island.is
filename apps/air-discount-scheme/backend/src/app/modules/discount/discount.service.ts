import { Injectable } from '@nestjs/common'
import { Discount } from './discount.model'

@Injectable()
export class DiscountService {
  async findByDiscountCodeAndNationalId(
    discountCode: string,
    nationalId: string,
  ): Promise<Discount> {
    // TODO: check redis if discountCode exists and belongs to the nationalId provided
    return new Discount(discountCode, nationalId, 4)
  }
}
