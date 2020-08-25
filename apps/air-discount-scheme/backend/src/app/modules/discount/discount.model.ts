import { ApiProperty } from '@nestjs/swagger'

import {
  Discount as DiscountType,
  FlightLegsLeft,
} from '@island.is/air-discount-scheme/types'

export class Discount implements DiscountType {
  constructor(
    discountCode: string,
    nationalId: string,
    ttl: number,
    flightLegsLeft: FlightLegsLeft,
  ) {
    this.discountCode = discountCode
    this.nationalId = nationalId
    this.expires = new Date(Date.now() + ttl * 1000)
    this.flightLegsLeft = flightLegsLeft
  }

  @ApiProperty()
  discountCode: string

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  expires: Date

  @ApiProperty()
  flightLegsLeft: FlightLegsLeft
}
