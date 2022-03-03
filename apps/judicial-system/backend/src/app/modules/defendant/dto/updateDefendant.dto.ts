import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean,IsOptional, IsString } from 'class-validator'

import { Gender } from '@island.is/judicial-system/types'

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
}
