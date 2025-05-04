import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CaseTableType } from '@island.is/judicial-system/types'

registerEnumType(CaseTableType, {
  name: 'CaseTableType',
  description: 'The type of a case table',
})

@ObjectType()
class CaseTableCell {
  @Field(() => [String], { description: 'The cell value' })
  readonly value!: string[]
}

@ObjectType()
class CaseTableRow {
  @Field(() => String, { description: 'The row case id' })
  readonly id!: string

  @Field(() => [CaseTableCell], { description: 'The row cells' })
  readonly cells!: CaseTableCell[]
}

@ObjectType()
export class CaseTableResponse {
  @Field(() => Number, { description: 'The number of rows' })
  readonly rowCount!: number

  @Field(() => [CaseTableRow], { description: 'The table rows' })
  readonly rows!: CaseTableRow[]
}
