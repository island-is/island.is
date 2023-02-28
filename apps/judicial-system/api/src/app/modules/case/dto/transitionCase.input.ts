import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type {
  CaseTransition,
  TransitionCase,
} from '@island.is/judicial-system/types'

@InputType()
export class TransitionCaseInput implements TransitionCase {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => String)
  readonly transition!: CaseTransition
}
