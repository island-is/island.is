import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AppealSummonsDefendantDto } from './createAppealSummons.dto'

export class PreviewAppealSummonsDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly caseName!: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsDefendantDto)
  @ApiProperty({ type: AppealSummonsDefendantDto, isArray: true })
  readonly defendants!: AppealSummonsDefendantDto[]

  // When previewing an edit, pass the summons id so defendants already on it
  // (including withdrawn appeals) still resolve the same way as update.
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly appealSummonsId?: string
}
