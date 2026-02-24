import { Transform } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseType } from '@island.is/judicial-system/types'

import { nationalIdTransformer } from '../../../transformers'

export class InternalCreateCaseV2Dto {
  @IsNotEmpty()
  @IsEnum(CaseType)
  @ApiProperty({ enum: CaseType })
  readonly type!: CaseType

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty({ type: String, isArray: true })
  readonly policeCaseNumbers!: string[]

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiProperty({ type: String })
  readonly prosecutorNationalId!: string

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly prosecutorsOfficeNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly leadInvestigator?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isHeightenedSecurityLevel?: boolean
}
