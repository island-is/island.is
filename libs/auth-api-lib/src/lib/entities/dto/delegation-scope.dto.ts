import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsDateString } from 'class-validator'

export class UpdateDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  validTo?: Date
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
