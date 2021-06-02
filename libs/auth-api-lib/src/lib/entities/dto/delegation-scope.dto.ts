import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsDateString } from 'class-validator'

export class DelegationScopeDTO {
  @IsString()
  @ApiProperty()
  delegationId!: string

  @IsString()
  @ApiProperty()
  scopeName?: string

  @IsDateString()
  @ApiProperty()
  validFrom!: Date

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  validTo?: Date
}
