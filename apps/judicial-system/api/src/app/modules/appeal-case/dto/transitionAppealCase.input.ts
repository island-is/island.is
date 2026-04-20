import { Allow } from 'class-validator'

import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql'

import { AppealCaseTransition } from '@island.is/judicial-system/types'

registerEnumType(AppealCaseTransition, { name: 'AppealCaseTransition' })

@InputType()
export class TransitionAppealCaseInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @Field(() => AppealCaseTransition)
  readonly transition!: AppealCaseTransition
}
