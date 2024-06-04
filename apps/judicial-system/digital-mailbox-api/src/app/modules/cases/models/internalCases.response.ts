import { ApiProperty } from '@nestjs/swagger'

import { CaseState } from '@island.is/judicial-system/types'

export class InternalCasesResponse {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  courtCaseNumber!: string

  @ApiProperty({ type: String })
  type!: string

  @ApiProperty({ type: String })
  state!: CaseState
}
