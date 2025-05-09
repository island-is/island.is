import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger'

export class StringGroupValue {
  @ApiProperty({ type: [String], description: 'The string values' })
  readonly s!: string[]
}

export class TagValue {
  @ApiProperty({ type: String, description: 'The tag color' })
  readonly color!: string

  @ApiProperty({ type: String, description: 'The tag text' })
  readonly text!: string
}

export type CaseTableCellValue = StringGroupValue | TagValue

export class CaseTableCell {
  @ApiPropertyOptional({
    oneOf: [
      { $ref: getSchemaPath(StringGroupValue) },
      { $ref: getSchemaPath(TagValue) },
    ],
    description: 'The cell value',
  })
  readonly value?: CaseTableCellValue
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
