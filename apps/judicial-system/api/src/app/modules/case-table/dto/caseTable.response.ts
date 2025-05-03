import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  CaseTableColumnType,
  CaseTableType,
} from '@island.is/judicial-system/types'

registerEnumType(CaseTableColumnType, {
  name: 'CaseTableColumnType',
  description: 'The type of a column in a case table',
})
registerEnumType(CaseTableType, {
  name: 'CaseTableType',
  description: 'The type of a case table',
})

@ObjectType()
class CaseTableColumn {
  @Field(() => String, { description: 'The column title' })
  readonly title!: string

  @Field(() => CaseTableColumnType, { description: 'The column type' })
  readonly type!: CaseTableColumnType
}

@ObjectType()
class CaseTableCell {
  @Field(() => [String], { description: 'The cell value' })
  readonly value!: string[]
}

@ObjectType()
class CaseTableRow {
  @Field(() => String, { description: 'The row case id' })
  readonly caseId!: string

  @Field(() => [CaseTableCell], { description: 'The row cells' })
  readonly cells!: CaseTableCell[]
}

@ObjectType()
export class CaseTableResponse {
  @Field(() => CaseTableType, { description: 'The table type' })
  readonly type!: CaseTableType

  @Field(() => Number, { description: 'The number of columns' })
  readonly columnCount!: number

  @Field(() => Number, { description: 'The number of rows' })
  readonly rowCount!: number

  @Field(() => [CaseTableColumn], { description: 'The table columns' })
  readonly columns!: CaseTableColumn[]

  @Field(() => [CaseTableRow], { description: 'The table rows' })
  readonly rows!: CaseTableRow[]
}
