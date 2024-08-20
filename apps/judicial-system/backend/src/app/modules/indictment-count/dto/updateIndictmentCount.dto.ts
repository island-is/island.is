import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

export class UpdateIndictmentCountDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly policeCaseNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly vehicleRegistrationNumber?: string

  @IsOptional()
  @IsArray()
  @IsEnum(IndictmentCountOffense, { each: true })
  @ApiPropertyOptional({ enum: IndictmentCountOffense, isArray: true })
  readonly offenses?: IndictmentCountOffense[]

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly substances?: SubstanceMap

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [Number, Number], isArray: true })
  readonly lawsBroken?: [number, number][]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly incidentDescription?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly legalArguments?: string
}
