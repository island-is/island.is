import { ApiProperty } from '@nestjs/swagger'

import { User as TUser, Fund } from '@island.is/air-discount-scheme/types'
import { SplitName } from './user.types'
import { ThjodskraUser } from '../thjodskra'

export class User implements TUser {
  constructor(user: ThjodskraUser, fund: Fund) {
    const { firstName, middleName, lastName } = this.parseName(user)

    this.firstName = firstName
    this.middleName = middleName
    this.lastName = lastName
    this.gender = user.gender
    this.nationalId = user.ssn
    this.address = user.address
    this.postalcode = user.postalcode
    this.city = user.city
    this.fund = fund
  }

  private parseName(user: ThjodskraUser): SplitName {
    const parts = user.name.split(' ')

    return {
      firstName: parts[0] || '',
      middleName: parts.slice(1, -1).join(' '),
      lastName: parts.slice(-1).pop() || '',
    }
  }

  @ApiProperty()
  firstName: string

  @ApiProperty()
  middleName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  gender: TUser['gender']

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
