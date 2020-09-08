import { ApiProperty } from '@nestjs/swagger'

import {
  User as TUser,
  AirlineUser as TAirlineUser,
  Fund as TFund,
} from '@island.is/air-discount-scheme/types'
import { NationalRegistryUser } from '../nationalRegistry'

class Fund implements TFund {
  @ApiProperty({
    description: 'Determines if the user has any discount credits left',
  })
  credit: number

  @ApiProperty()
  used: number

  @ApiProperty()
  total: number
}

export class AirlineUser implements TAirlineUser {
  constructor(user: NationalRegistryUser, fund: Fund) {
    this.firstName = user.firstName
    this.middleName = user.middleName
    this.lastName = user.lastName
    this.gender = user.gender
    this.nationalId = AirlineUser.maskNationalId(user.nationalId)
    this.fund = fund
  }

  private static maskNationalId(nationalId: string): string {
    return `${nationalId.slice(0, 6)}xxx${nationalId.slice(-1)}`
  }

  @ApiProperty()
  firstName: string

  @ApiProperty()
  middleName: string

  @ApiProperty()
  lastName: string

  @ApiProperty({ enum: ['kvk', 'kk'] as ValueOf<TUser['gender']>[] })
  gender: TUser['gender']

  @ApiProperty()
  nationalId: string

  @ApiProperty({ type: Fund })
  fund: TFund
}

export class User extends AirlineUser implements TUser {
  constructor(user: NationalRegistryUser, fund: Fund) {
    super(user, fund)
    this.address = user.address
    this.postalcode = user.postalcode
    this.city = user.city
  }

  @ApiProperty()
  address: string

  @ApiProperty()
  postalcode: number

  @ApiProperty()
  city: string
}
