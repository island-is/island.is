import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AppealSummonsDefendantDto } from './createAppealSummons.dto'

export class PreviewAppealSummonsDto {
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
