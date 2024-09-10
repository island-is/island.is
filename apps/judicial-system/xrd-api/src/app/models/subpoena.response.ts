import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { DefenderChoice } from '@island.is/judicial-system/types'

export class SubpoenaResponse {
  @ApiProperty({ type: () => Boolean })
  acknowledged?: boolean

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
