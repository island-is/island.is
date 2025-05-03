import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CaseTableType } from '@island.is/judicial-system/types'

@InputType()
export class CaseTableQueryInput {
  @Allow()
  @Field(() => CaseTableType)
  readonly type!: CaseTableType
}
