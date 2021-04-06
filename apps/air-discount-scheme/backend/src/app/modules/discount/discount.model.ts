import { ApiProperty } from '@nestjs/swagger'

import {
  ConnectionDiscountCode,
  Discount as TDiscount,
} from '@island.is/air-discount-scheme/types'

export class Discount implements TDiscount {
  constructor(
    discountCode: string,
    connectionDiscountCodes: ConnectionDiscountCode[],
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
  connectionDiscountCodes: ConnectionDiscountCode[]
  @ApiProperty()
  nationalId: string

  @ApiProperty()
  expiresIn: number
}
