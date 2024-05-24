import { ApiProperty } from '@nestjs/swagger'

import { IndictmentCaseData } from '@island.is/judicial-system/types'

export class CaseResponse {
  @ApiProperty({ type: Object })
  data!: IndictmentCaseData
}
