import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { DefenderChoice, Gender } from '@island.is/judicial-system/types'

import { nationalIdTransformer } from '../../../transformers'

export class CreateDefendantDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly noNationalId?: boolean

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly dateOfBirth?: string

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

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly defenderNationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiPropertyOptional({ enum: DefenderChoice })
  readonly defenderChoice?: DefenderChoice
}
