import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { DefendantPlea, Gender } from '@island.is/judicial-system/types'

export class UpdateDefendantDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly noNationalId?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: Gender })
  readonly gender?: Gender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly address?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly citizenship?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly defendantWaivesRightToCounsel?: boolean

  @IsOptional()
  @IsEnum(DefendantPlea)
  @ApiPropertyOptional({ enum: DefendantPlea })
  readonly defendantPlea?: DefendantPlea
}
