import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsDateString, IsISO8601 } from 'class-validator'

export class UpdateDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsISO8601()
  @ApiPropertyOptional()
  validFrom?: Date

  @IsOptional()
  @IsISO8601()
  @ApiProperty()
  validTo!: Date
}

export class DelegationScopeDTO {
  @IsString()
  @ApiProperty()
  delegationId!: string

  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsDateString()
  @ApiProperty()
  validFrom!: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  validTo?: Date
}
