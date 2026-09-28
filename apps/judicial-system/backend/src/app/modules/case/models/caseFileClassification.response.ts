import { ApiProperty } from '@nestjs/swagger'

import { CaseFileClassification } from '@island.is/judicial-system/types'

export class CaseFileClassificationResponse {
  @ApiProperty({ enum: CaseFileClassification })
  classification!: CaseFileClassification
}
