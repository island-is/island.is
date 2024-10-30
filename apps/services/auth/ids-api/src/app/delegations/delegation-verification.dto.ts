import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsString } from 'class-validator'

import { AuthDelegationType } from '@island.is/shared/types'

export class DelegationVerification {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsArray()
  @IsEnum(AuthDelegationType, { each: true })
  @ApiProperty({
    enum: AuthDelegationType,
    enumName: 'AuthDelegationType',
    isArray: true,
  })
  delegationTypes!: AuthDelegationType[]
}
