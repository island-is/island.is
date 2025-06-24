import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { VerdictAppealDecision } from '@island.is/judicial-system/types'

export class UpdateVerdictAppealDto {
  @IsNotEmpty()
  @IsEnum(VerdictAppealDecision)
  @ApiProperty({ enum: VerdictAppealDecision })
  readonly verdictAppealDecision!: VerdictAppealDecision
}
