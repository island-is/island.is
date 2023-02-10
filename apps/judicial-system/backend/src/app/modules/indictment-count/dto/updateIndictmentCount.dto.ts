import { IsString, IsOptional } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

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

  @IsOptional()
  @ApiPropertyOptional()
  readonly offenses?: IndictmentCountOffense[]
}
