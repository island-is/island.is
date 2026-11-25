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
    this.gender = user.gender
    this.nationalId = user.nationalId
    this.fund = fund
  }

  // https://docs.nestjs.com/openapi/types-and-parameters#enums
  // We must manually set the enum property
  @ApiProperty({
    enum: ['kk', 'kvk', 'x', 'manneskja'],
  })
  gender: TUser['gender']

  @ApiProperty()
  nationalId: string

  @ApiProperty({ type: Fund })
  fund: TFund
}

export class AirlineUser extends BaseUser implements BaseUser {
  constructor(user: NationalRegistryUser, fund: Fund) {
    super(user, fund)
    const nameParts = user.fullName.split(' ')
    this.nationalId = AirlineUser.maskNationalId(this.nationalId)
    this.firstName = nameParts[0] ?? ''
    this.middleName = nameParts.slice(1, -1).join(' ')
    this.lastName = nameParts.slice(-1).pop() ?? ''
  }

  @ApiProperty()
  firstName: string

  @ApiProperty()
  middleName: string

  @ApiProperty()
  lastName: string

  private static maskNationalId(nationalId: string): string {
    return `${nationalId.slice(0, 6)}xxx${nationalId.slice(-1)}`
  }
}

export class User extends BaseUser implements TUser {
  constructor(user: NationalRegistryUser, fund: Fund) {
    super(user, fund)
    this.givenName = user.givenName
    this.fullName = user.fullName
    this.address = user.address
    this.postalcode = user.postalcode
    this.city = user.city
  }

  @ApiProperty({ description: 'All given names (eiginnafn)' })
  givenName: string

  @ApiProperty()
  fullName: string

  @ApiProperty()
  address: string

  @ApiProperty()
  postalcode: number

  @ApiProperty()
  city: string
}

export type CachedUser = Omit<TUser, 'givenName' | 'fullName'> &
  Partial<Pick<TUser, 'givenName' | 'fullName'>> &
  Partial<Record<'firstName' | 'middleName' | 'lastName', string>>

export const restoreCachedUser = ({
  fund: _fund,
  firstName,
  middleName,
  lastName,
  givenName,
  fullName,
  ...user
}: CachedUser): NationalRegistryUser => ({
  ...user,
  givenName: givenName ?? [firstName, middleName].filter(Boolean).join(' '),
  fullName:
    fullName ?? [firstName, middleName, lastName].filter(Boolean).join(' '),
})
