import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AppealCaseTransition } from '@island.is/judicial-system/types'

export class TransitionAppealCaseDto {
  @IsNotEmpty()
  @IsEnum(AppealCaseTransition)
  @ApiProperty({ enum: AppealCaseTransition })
  readonly transition!: AppealCaseTransition

  /**********
   * The defendant the transition applies to. Required when withdrawing a
   * verdict appeal, which is withdrawn for one defendant at a time; meaningless for
   * every other transition.
   **********/
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string
}
