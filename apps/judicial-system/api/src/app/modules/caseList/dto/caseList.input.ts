import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CaseAppealState } from '@island.is/judicial-system/types'

@InputType()
export class CaseListQueryInput {
  @Allow()
  @Field(() => [String], { nullable: true })
  readonly appealState?: [CaseAppealState]
}
