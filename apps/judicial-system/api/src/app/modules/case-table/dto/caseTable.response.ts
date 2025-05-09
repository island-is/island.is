import {
  createUnionType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

import { CaseTableType } from '@island.is/judicial-system/types'

registerEnumType(CaseTableType, {
  name: 'CaseTableType',
  description: 'The type of a case table',
})

@ObjectType()
class StringGroup {
  @Field(() => [String], { description: 'The string values' })
  readonly s!: string[]
}

@ObjectType()
export class Tag {
  @Field(() => String, { description: 'The tag color' })
  readonly color!: string

  @Field(() => String, { description: 'The tag text' })
  readonly text!: string
}

const CaseTableCellValue = createUnionType({
  name: 'CaseTableCellValue',
  types: () => [StringGroup, Tag] as const,
  resolveType(value) {
    if ('s' in value) {
      return StringGroup
    }
    if ('color' in value && 'text' in value) {
      return Tag
    }
    return null
  },
})

@ObjectType()
class CaseTableCell {
  @Field(() => CaseTableCellValue, {
    description: 'The cell value',
    nullable: true,
  })
  readonly value?: typeof CaseTableCellValue
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
  @Field(() => Number, { description: 'The number of rows' })
  readonly rowCount!: number

  @Field(() => [CaseTableRow], { description: 'The table rows' })
  readonly rows!: CaseTableRow[]
}
