import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { AppealCaseTransition } from '@island.is/judicial-system/types'

export class TransitionAppealCaseDto {
  @IsNotEmpty()
  @IsEnum(AppealCaseTransition)
  @ApiProperty({ enum: AppealCaseTransition })
  readonly transition!: AppealCaseTransition
}
