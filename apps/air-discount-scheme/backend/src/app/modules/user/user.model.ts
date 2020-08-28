import { ApiProperty } from '@nestjs/swagger'

import {
  User as TUser,
  ThjodskraUser,
  Fund,
} from '@island.is/air-discount-scheme/types'

export class User implements TUser {
  constructor(user: ThjodskraUser, fund: Fund) {
    this.firstName = user.firstName
    this.middleName = user.middleName
    this.lastName = user.lastName
    this.gender = user.gender
    this.nationalId = user.nationalId
    this.address = user.address
    this.postalcode = user.postalcode
    this.city = user.city
    this.fund = fund
  }

  @ApiProperty()
  firstName: string

  @ApiProperty()
  middleName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  gender: string

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  address: string

  @ApiProperty()
  postalcode: number

  @ApiProperty()
  city: string

  @ApiProperty()
  fund: Fund
}
