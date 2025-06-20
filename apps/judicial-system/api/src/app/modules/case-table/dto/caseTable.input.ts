import { Allow } from 'class-validator'

import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { CaseTableType } from '@island.is/judicial-system/types'

registerEnumType(CaseTableType, {
  name: 'CaseTableType',
  description: 'The type of a case table',
})

@InputType()
export class CaseTableQueryInput {
  @Allow()
  @Field(() => CaseTableType)
  readonly type!: CaseTableType
}
