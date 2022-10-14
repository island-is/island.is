import { ApiProperty } from '@nestjs/swagger'

import {
  ConnectionDiscountCode,
  Discount as TDiscount,
} from '@island.is/air-discount-scheme/types'
import { User } from '../user/user.model'

export class Discount implements TDiscount {
  constructor(
    user: User,
    discountCode: string,
    connectionDiscountCodes: ConnectionDiscountCode[],
    nationalId: string,
    ttl: number,
    explicitBy = '',
  ) {
    this.user = user
    this.discountCode = discountCode
    this.connectionDiscountCodes = connectionDiscountCodes
    this.nationalId = nationalId
    this.expiresIn = ttl
    this.explicitBy = explicitBy
  }
  @ApiProperty()
  user: User

  @ApiProperty()
  discountCode: string

  @ApiProperty()
  connectionDiscountCodes: ConnectionDiscountCode[]
  @ApiProperty()
  nationalId: string

  @ApiProperty()
  expiresIn: number

  @ApiProperty()
  explicitBy: string
}
