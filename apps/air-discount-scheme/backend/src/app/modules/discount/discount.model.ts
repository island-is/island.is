import { ApiProperty } from '@nestjs/swagger'

import { Discount as TDiscount } from '@island.is/air-discount-scheme/types'

export class Discount implements TDiscount {
  constructor(
    discountCode: string,
    connectionDiscountCodes: {
      code: string
      flightId: string
      validUntil: string
    }[],
    nationalId: string,
    ttl: number,
  ) {
    this.discountCode = discountCode
    this.connectionDiscountCodes = connectionDiscountCodes
    this.nationalId = nationalId
    this.expiresIn = ttl
  }

  @ApiProperty()
  discountCode: string

  @ApiProperty()
  connectionDiscountCodes: {
    code: string
    flightId: string
    validUntil: string
  }[]

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  expiresIn: number
}
