import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import {
  IndictmentCountOffense,
  IndictmentSubtype,
} from '@island.is/judicial-system/types'

export class UpdateIndictmentCountDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly policeCaseNumber?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly vehicleRegistrationNumber?: string

  @IsOptional()
  @IsArray()
  @IsEnum(IndictmentCountOffense, { each: true })
  @ApiPropertyOptional({ enum: IndictmentCountOffense, isArray: true })
  readonly deprecatedOffenses?: IndictmentCountOffense[]

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

  @IsOptional()
  @IsArray()
  @IsEnum(IndictmentSubtype, { each: true })
  @ApiPropertyOptional({ enum: IndictmentSubtype, isArray: true })
  readonly policeCaseNumberSubtypes?: IndictmentSubtype[]

  @IsOptional()
  @IsArray()
  @IsEnum(IndictmentSubtype, { each: true })
  @ApiPropertyOptional({ enum: IndictmentSubtype, isArray: true })
  readonly indictmentCountSubtypes?: IndictmentSubtype[]

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  readonly recordedSpeed?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  readonly speedLimit?: number
}
