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
  Matches,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { POLICE_CASE_NUMBER_REGEX } from '@island.is/judicial-system/consts'
import { CaseType } from '@island.is/judicial-system/types'

import { nationalIdTransformer } from '../../../transformers'

export class InternalCreateCaseDto {
  @IsNotEmpty()
  @IsEnum(CaseType)
  @ApiProperty({ enum: CaseType })
  readonly type!: CaseType

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(POLICE_CASE_NUMBER_REGEX, { each: true })
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
