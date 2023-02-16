import { IsString, IsOptional } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateIndictmentCountDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeCaseNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly vehicleRegistrationNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly incidentDescription?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly legalArguments?: string
}
