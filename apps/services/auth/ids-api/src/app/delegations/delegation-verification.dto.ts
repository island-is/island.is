import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsString } from 'class-validator'

import {
  DelegationRecordType,
  PersonalRepresentativeDelegationType,
} from '@island.is/auth-api-lib'
import { AuthDelegationType } from '@island.is/shared/types'

// Delegations sourced from the district commissioners registry carry compound
// personal representative types, e.g. PersonalRepresentative:postholf, so the
// accepted values are the DelegationRecordType union rather than the base
// AuthDelegationType enum.
const delegationRecordTypes: DelegationRecordType[] = [
  ...Object.values(AuthDelegationType),
  ...Object.values(PersonalRepresentativeDelegationType),
]

export class DelegationVerification {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsArray()
  @IsIn(delegationRecordTypes, { each: true })
  @ApiProperty({
    enum: delegationRecordTypes,
    enumName: 'DelegationRecordType',
    isArray: true,
  })
  delegationTypes!: DelegationRecordType[]
}
