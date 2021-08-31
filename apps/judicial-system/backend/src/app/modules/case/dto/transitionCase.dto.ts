import { IsEnum, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CaseTransition } from '@island.is/judicial-system/types'

export class TransitionCaseDto {
  @IsString()
  @ApiProperty()
  readonly modified!: Date

  @IsEnum(CaseTransition)
  @ApiProperty({ enum: CaseTransition })
  readonly transition!: CaseTransition
}
