import { Field, ObjectType } from '@nestjs/graphql'

import { CaseTableType } from '@island.is/judicial-system/types'

@ObjectType()
class CaseTableDesctiptor {
  @Field(() => CaseTableType, { description: 'The table type' })
  readonly type!: CaseTableType

  @Field(() => String, { description: 'The table title' })
  readonly title!: string

  @Field(() => String, { description: 'The table description' })
  readonly description!: string
}

@ObjectType()
class CaseTableGroup {
  @Field(() => String, { description: 'The group title' })
  readonly title!: string

  @Field(() => [CaseTableDesctiptor], { description: 'The group tables' })
  readonly tables!: CaseTableDesctiptor[]
}

@ObjectType()
export class CaseTablesResponse {
  @Field(() => [CaseTableGroup], { description: 'The available table groups' })
  readonly groups!: CaseTableGroup[]
}
