import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CaseTransition } from '@island.is/judicial-system/types'

export class TransitionCaseDto {
  @IsNotEmpty()
  @IsEnum(CaseTransition)
  @ApiProperty({ enum: CaseTransition })
  readonly transition!: CaseTransition
}
