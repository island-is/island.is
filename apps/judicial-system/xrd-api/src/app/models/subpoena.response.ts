import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { DefenderChoice } from '@island.is/judicial-system/types'

export class SubpoenaResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: () => DefenderInfo })
  defenderInfo?: DefenderInfo
}

class DefenderInfo {
  @IsEnum(DefenderChoice)
  @ApiProperty({ enum: DefenderChoice })
  defenderChoice!: DefenderChoice

  @ApiProperty({ type: String })
  defenderName?: string
}
