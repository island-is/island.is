import { Allow } from 'class-validator'

import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql'

import {
  CaseIndictmentRulingDecision,
  CaseTransition,
  IndictmentDecision,
} from '@island.is/judicial-system/types'

registerEnumType(CaseTransition, { name: 'CaseTransition' })

// IndictmentDecision and CaseIndictmentRulingDecision are registered in case.model.ts

@InputType()
export class TransitionCaseInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @Field(() => CaseTransition)
  readonly transition!: CaseTransition

  @Allow()
  @Field(() => IndictmentDecision, { nullable: true })
  readonly indictmentDecision?: IndictmentDecision

  @Allow()
  @Field(() => CaseIndictmentRulingDecision, { nullable: true })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision
}
