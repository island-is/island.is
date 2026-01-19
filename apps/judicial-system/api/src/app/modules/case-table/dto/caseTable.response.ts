import {
  createUnionType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

import {
  CaseActionType,
  ContextMenuCaseActionType,
} from '@island.is/judicial-system/types'

registerEnumType(CaseActionType, {
  name: 'CaseActionType',
  description: 'The actions that can be taken on a case',
})
registerEnumType(ContextMenuCaseActionType, {
  name: 'ContextMenuCaseActionType',
  description: 'The actions that can be taken on a case in a context menu',
})

@ObjectType()
class StringValue {
  @Field(() => String, { description: 'The string value' })
  readonly str!: string
}

@ObjectType()
class StringGroupValue {
  @Field(() => [String], { description: 'The string values' })
  readonly strList!: string[]

  @Field(() => Boolean, {
    description: 'Indicates if the group should have a check mark',
    nullable: true,
  })
  readonly hasCheckMark?: boolean
}

@ObjectType()
export class TagValue {
  @Field(() => String, { description: 'The tag color' })
  readonly color!: string

  @Field(() => String, { description: 'The tag text' })
  readonly text!: string
}

@ObjectType()
export class TagPairValue {
  @Field(() => TagValue, { description: 'The first tag value' })
  readonly firstTag!: TagValue

  @Field(() => TagValue, {
    description: 'The second tag value',
    nullable: true,
  })
  readonly secondTag?: TagValue
}

const CaseTableCellValue = createUnionType({
  name: 'CaseTableCellValue',
  types: () => [StringValue, StringGroupValue, TagValue, TagPairValue] as const,
  resolveType(value) {
    if ('str' in value) {
      return StringValue
    }

    if ('strList' in value) {
      return StringGroupValue
    }

    if ('color' in value && 'text' in value) {
      return TagValue
    }

    if ('firstTag' in value) {
      return TagPairValue
    }

    // This should never happen, but if it does, we return null
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

  @Field(() => String, { description: 'The cell sort value', nullable: true })
  readonly sortValue?: string
}

@ObjectType()
class CaseTableRow {
  @Field(() => String, { description: 'The row case id' })
  readonly caseId!: string

  @Field(() => String, { description: 'The row defendant id', nullable: true })
  readonly defendantId?: string

  @Field(() => Boolean, {
    description: 'Indicates if the case belongs to the current user',
  })
  readonly isMyCase!: boolean

  @Field(() => CaseActionType, {
    description: 'The action to take on row click',
  })
  readonly actionOnRowClick!: CaseActionType

  @Field(() => [ContextMenuCaseActionType], {
    description: 'The available context menu actions',
  })
  readonly contextMenuActions!: ContextMenuCaseActionType[]

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
