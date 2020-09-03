import { ApiProperty } from '@nestjs/swagger'

import {
  User as TUser,
  Fund as TFund,
} from '@island.is/air-discount-scheme/types'
import { NationalRegistryUser } from '../nationalRegistry'

class Fund implements TFund {
  @ApiProperty()
  nationalId: string

  @ApiProperty({
    description: 'Determines if the user has any discount credits left',
  })
  credit: number

  @ApiProperty()
  used: number

  @ApiProperty()
  total: number
}

export class User implements TUser {
  constructor(user: NationalRegistryUser, fund: Fund) {
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

  @ApiProperty({ enum: ['kvk', 'kk'] as ValueOf<TUser['gender']>[] })
  gender: TUser['gender']

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  address: string

  @ApiProperty()
  postalcode: number

  @ApiProperty()
  city: string

  @ApiProperty({ type: Fund })
  fund: TFund
}
