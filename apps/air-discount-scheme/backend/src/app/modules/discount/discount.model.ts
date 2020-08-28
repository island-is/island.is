import { ApiProperty } from '@nestjs/swagger'

import { Discount as TDiscount } from '@island.is/air-discount-scheme/types'

export class Discount implements TDiscount {
  constructor(discountCode: string, nationalId: string, ttl: number) {
    this.discountCode = discountCode
    this.nationalId = nationalId
    this.expires = new Date(Date.now() + ttl * 1000)
  }

  @ApiProperty()
  discountCode: string

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  expires: Date
}
