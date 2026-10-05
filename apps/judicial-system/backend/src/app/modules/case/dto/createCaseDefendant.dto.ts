import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { Gender } from '@island.is/judicial-system/types'

import { nationalIdTransformer } from '../../../transformers'

// A defendant created together with its case: only the fields a prosecutor
// can enter for a defendant before the case exists. Defender details are
// deliberately left out, since those go through the defendant update path.
export class CreateCaseDefendantDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly noNationalId?: boolean

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly name?: string

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({ enum: Gender })
  readonly gender?: Gender

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly address?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly citizenship?: string
}
