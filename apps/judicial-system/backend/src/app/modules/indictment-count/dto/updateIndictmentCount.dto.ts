import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

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
  @IsEnum(IndictmentCountOffense, { each: true })
  @ApiPropertyOptional({ enum: IndictmentCountOffense, isArray: true })
  readonly offenses?: IndictmentCountOffense[]

  @IsOptional()
  @IsArray({ each: true })
  @ApiPropertyOptional({ type: [[Number, Number]], isArray: true })
  readonly lawsBroken?: [number, number][]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly incidentDescription?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly legalArguments?: string

  @IsOptional()
  @ApiPropertyOptional({ enum: IndictmentCountOffense, isArray: true })
  readonly offenses?: IndictmentCountOffense[]
}
