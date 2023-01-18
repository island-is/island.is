import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { xCaseTransition } from '@island.is/judicial-system/types'

export class TransitionCaseDto {
  @IsEnum(xCaseTransition)
  @ApiProperty({ enum: xCaseTransition })
  readonly transition!: xCaseTransition
}
