import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { DefenderChoice } from '@island.is/judicial-system/types'

const appealSummonsCounselChoices = [
  DefenderChoice.CHOOSE,
  DefenderChoice.WAIVE,
] as const

export class UpdateAppealSummonsDto {
  @IsNotEmpty()
  @IsEnum(DefenderChoice)
  @IsIn(appealSummonsCounselChoices)
  @ApiProperty({
    enum: DefenderChoice,
    description: 'Only CHOOSE or WAIVE are allowed for appeal summons',
  })
  defenderChoice!: DefenderChoice.CHOOSE | DefenderChoice.WAIVE

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  defenderNationalId?: string
}
