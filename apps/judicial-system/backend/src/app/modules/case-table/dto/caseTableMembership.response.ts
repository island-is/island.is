import { ApiProperty } from '@nestjs/swagger'

import { CaseTableType } from '@island.is/judicial-system/types'

export class CaseTableMembershipResponse {
  @ApiProperty({
    enum: CaseTableType,
    isArray: true,
    description:
      'Case table types (for the current user role) that this case belongs to',
  })
  readonly caseTableTypes!: CaseTableType[]
}
