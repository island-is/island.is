import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { IndictmentSubtype } from '@island.is/judicial-system/types'

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
