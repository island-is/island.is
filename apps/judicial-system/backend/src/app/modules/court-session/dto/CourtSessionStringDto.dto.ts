import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

export class CourtSessionStringDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly mergedCaseId?: string

  @IsOptional()
  @IsEnum(CourtSessionStringType)
  @ApiPropertyOptional({ enum: CourtSessionStringType })
  readonly stringType?: CourtSessionStringType

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly value?: string
}
