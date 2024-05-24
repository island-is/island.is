import { IndictmentCaseData } from '@island.is/judicial-system/types'
import { ApiProperty } from '@nestjs/swagger'

export class InternalCaseResponse {
  @ApiProperty({ type: Object })
  data!: IndictmentCaseData
}
