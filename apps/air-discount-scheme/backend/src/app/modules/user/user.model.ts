import { ApiProperty } from '@nestjs/swagger'

import {
  BaseUser as TBaseUser,
  User as TUser,
  Fund as TFund,
} from '@island.is/air-discount-scheme/types'
import { NationalRegistryUser } from '../nationalRegistry'

class Fund implements TFund {
  @ApiProperty({
    description: 'Determines if the user has any discount credits left',
  })
  credit!: number

  @ApiProperty()
  used!: number

  @ApiProperty()
  total!: number
}

class BaseUser implements TBaseUser {
  constructor(user: NationalRegistryUser, fund: Fund) {
    this.firstName = user.firstName
    this.middleName = user.middleName
    this.lastName = user.lastName
    this.gender = user.gender
    this.nationalId = user.nationalId
    this.fund = fund
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

export class AirlineUser extends BaseUser implements BaseUser {
  constructor(user: NationalRegistryUser, fund: Fund) {
    super(user, fund)
    this.nationalId = AirlineUser.maskNationalId(this.nationalId)
  }

  private static maskNationalId(nationalId: string): string {
    return `${nationalId.slice(0, 6)}xxx${nationalId.slice(-1)}`
  }
}

export class User extends BaseUser implements TUser {
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
