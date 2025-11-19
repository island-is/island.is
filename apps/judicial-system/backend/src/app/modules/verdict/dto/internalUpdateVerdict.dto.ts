import { IsEnum, IsOptional } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { VerdictAppealDecision } from '@island.is/judicial-system/types'

export class InternalUpdateVerdictDto {
  @IsOptional()
  @IsEnum(VerdictAppealDecision)
  @ApiPropertyOptional({ enum: VerdictAppealDecision })
  readonly appealDecision?: VerdictAppealDecision
}
