import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { DefenderChoice, Gender } from '@island.is/judicial-system/types'

export class CreateDefendantDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly noNationalId?: boolean

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly name?: string

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({ enum: Gender })
  readonly gender?: Gender

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly address?: string

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly citizenship?: string

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderName?: string

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderNationalId?: string

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderEmail?: string

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiPropertyOptional({ enum: DefenderChoice })
  readonly defenderChoice?: DefenderChoice
}
