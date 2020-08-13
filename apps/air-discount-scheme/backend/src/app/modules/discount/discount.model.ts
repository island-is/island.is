import { ApiProperty } from '@nestjs/swagger'

export class Discount {
  constructor(
    discountCode: string,
    nationalId: string,
    flightLegsLeft: number,
  ) {
    this.discountCode = discountCode
    this.nationalId = nationalId
    this.flightLegsLeft = flightLegsLeft
  }

  @ApiProperty()
  discountCode: string

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  flightLegsLeft: number
}
