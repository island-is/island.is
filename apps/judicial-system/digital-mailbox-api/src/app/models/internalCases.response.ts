import { CaseState } from '@island.is/judicial-system/types'
import { ApiProperty } from '@nestjs/swagger'

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
