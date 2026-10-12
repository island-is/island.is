import { ApiProperty } from '@nestjs/swagger'

import { CasePoliceState } from '@island.is/judicial-system/types'

export class CasePoliceStateResponse {
  @ApiProperty({ enum: CasePoliceState })
  state!: CasePoliceState
}
