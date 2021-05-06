import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class DelegationScopeDeleteDTO {
  @IsString()
  @ApiProperty()
  delegationId!: string
  @IsOptional()
  @IsString()
  @ApiProperty()
  scopeName?: string
}
