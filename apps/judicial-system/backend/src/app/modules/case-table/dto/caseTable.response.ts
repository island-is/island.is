import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger'

export class StringValue {
  @ApiProperty({ type: String, description: 'The string value' })
  readonly str!: string
}

export class StringGroupValue {
  @ApiProperty({ type: [String], description: 'The string values' })
  readonly strList!: string[]

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indicates if the group should have a check mark',
  })
  readonly hasCheckMark?: boolean
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

export type CaseTableCellValue =
  | StringValue
  | StringGroupValue
  | TagValue
  | TagPairValue

export class CaseTableCell {
  @ApiPropertyOptional({
    oneOf: [
      { $ref: getSchemaPath(StringValue) },
      { $ref: getSchemaPath(StringGroupValue) },
      { $ref: getSchemaPath(TagValue) },
      { $ref: getSchemaPath(TagPairValue) },
    ],
    description: 'The cell value',
  })
  readonly value?: CaseTableCellValue

  @ApiPropertyOptional({ type: String, description: 'The cell sort value' })
  readonly sortValue?: string
}

class CaseTableRow {
  @ApiProperty({ type: String, description: 'The row case id' })
  readonly caseId!: string

  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the case belongs to the current user',
  })
  readonly isMyCase!: boolean

  @ApiProperty({ type: [CaseTableCell], description: 'The row cells' })
  readonly cells!: CaseTableCell[]
}

export class CaseTableResponse {
  @ApiProperty({ type: Number, description: 'The number of rows' })
  readonly rowCount!: number

  @ApiProperty({ type: [CaseTableRow], description: 'The table rows' })
  readonly rows!: CaseTableRow[]
}
