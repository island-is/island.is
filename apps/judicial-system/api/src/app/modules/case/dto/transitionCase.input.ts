import { Allow } from 'class-validator'

import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql'

import { CaseTransition } from '@island.is/judicial-system/types'

registerEnumType(CaseTransition, { name: 'CaseTransition' })

@InputType()
export class TransitionCaseInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @Field(() => CaseTransition)
  readonly transition!: CaseTransition
}
