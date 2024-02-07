import { Allow } from 'class-validator'

import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { CaseTransition } from '@island.is/judicial-system/types'

registerEnumType(CaseTransition, { name: 'CaseTransition' })

@InputType()
export class TransitionCaseInput {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => CaseTransition)
  readonly transition!: CaseTransition
}
