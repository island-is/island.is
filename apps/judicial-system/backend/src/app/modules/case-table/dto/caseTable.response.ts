import { ApiProperty } from '@nestjs/swagger'

import {
  CaseTableColumnType,
  CaseTableType,
} from '@island.is/judicial-system/types'

class CaseTableColumn {
  @ApiProperty({ type: String, description: 'The column title' })
  readonly title!: string

  @ApiProperty({ enum: CaseTableColumnType, description: 'The column type' })
  readonly type!: CaseTableColumnType
}

class CaseTableCell {
  @ApiProperty({ type: [String], description: 'The cell value' })
  readonly value!: string[]
}

class CaseTableRow {
  @ApiProperty({ type: String, description: 'The row case id' })
  readonly caseId!: string

  @ApiProperty({ type: [CaseTableCell], description: 'The row cells' })
  readonly cells!: CaseTableCell[]
}

export class CaseTableResponse {
  @ApiProperty({ enum: CaseTableType, description: 'The table type' })
  readonly type!: CaseTableType

  @ApiProperty({ type: Number, description: 'The number of columns' })
  readonly columnCount!: number

  @ApiProperty({ type: Number, description: 'The number of rows' })
  readonly rowCount!: number

  @ApiProperty({ type: [CaseTableColumn], description: 'The table columns' })
  readonly columns!: CaseTableColumn[]

  @ApiProperty({ type: [CaseTableRow], description: 'The table rows' })
  readonly rows!: CaseTableRow[]
}
