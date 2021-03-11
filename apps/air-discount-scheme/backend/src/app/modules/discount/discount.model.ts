import { ApiProperty } from '@nestjs/swagger'

import { Discount as TDiscount } from '@island.is/air-discount-scheme/types'

export class Discount implements TDiscount {
  constructor(
    discountCode: string,
    connectionDiscountCode: string[],
    nationalId: string,
    ttl: number,
  ) {
    this.discountCode = discountCode
    this.connectionDiscountCode = connectionDiscountCode
    this.nationalId = nationalId
    this.expiresIn = ttl
  }

  @ApiProperty()
  discountCode: string

  @ApiProperty()
  connectionDiscountCode: string[]

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  expiresIn: number
}
