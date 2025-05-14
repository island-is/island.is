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

export class TagPairValue {
  @ApiProperty({ type: TagValue, description: 'The first tag value' })
  readonly firstTag!: TagValue

  @ApiPropertyOptional({ type: TagValue, description: 'The second tag value' })
  readonly secondTag?: TagValue
}

export type CaseTableCellValue = StringGroupValue | TagValue | TagPairValue

export class CaseTableCell {
  @ApiPropertyOptional({
    oneOf: [
      { $ref: getSchemaPath(StringGroupValue) },
      { $ref: getSchemaPath(TagValue) },
      { $ref: getSchemaPath(TagPairValue) },
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
