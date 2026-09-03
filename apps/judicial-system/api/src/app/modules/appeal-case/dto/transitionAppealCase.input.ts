import { Allow, IsOptional, IsUUID } from 'class-validator'

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

  // The defendant the transition applies to. Required when withdrawing an
  // áfrýjun, which is withdrawn for one defendant at a time; meaningless for
  // every other transition.
  @Allow()
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  readonly defendantId?: string
}
