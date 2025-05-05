import { ApiProperty } from '@nestjs/swagger'

class StringGroup {
  @ApiProperty({ type: [String], description: 'The string values' })
  readonly s!: string[]
}

export class CaseTableCell {
  @ApiProperty({ type: StringGroup, description: 'The cell value' })
  readonly value!: StringGroup
}

class CaseTableRow {
  @ApiProperty({ type: String, description: 'The row case id' })
  readonly caseId!: string

  @ApiProperty({ type: [CaseTableCell], description: 'The row cells' })
  readonly cells!: CaseTableCell[]
}

export class CaseTableResponse {
  @ApiProperty({ type: Number, description: 'The number of rows' })
  readonly rowCount!: number

  @ApiProperty({ type: [CaseTableRow], description: 'The table rows' })
  readonly rows!: CaseTableRow[]
}
