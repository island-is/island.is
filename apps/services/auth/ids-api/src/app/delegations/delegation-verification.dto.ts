import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsString } from 'class-validator'

export class DelegationVerification {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsArray()
  @Type(() => String)
  @ApiProperty({ type: [String] })
  delegationTypes!: string[]
}
