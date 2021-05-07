import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DelegationScopeDTO {
  @IsString()
  @ApiProperty()
  delegationId!: string

  @IsString()
  @ApiProperty()
  scopeName?: string
}
