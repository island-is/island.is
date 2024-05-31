import { ApiProperty } from '@nestjs/swagger'

import { DefenderChoice } from '@island.is/judicial-system/types'

export class SubpoenaResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: DefenderChoice })
  defenderChoice?: DefenderChoice

  @ApiProperty({ type: String })
  defenderName?: string
}
