import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  DefendantPlea,
  Gender,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateDefendantInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly noNationalId?: boolean

  @Allow()
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly name?: string

  @Allow()
  @Field(() => Gender, { nullable: true })
  readonly gender?: Gender

  @Allow()
  @Field(() => String, { nullable: true })
  readonly address?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly citizenship?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly defendantWaivesRightToCounsel?: boolean

  @Allow()
  @Field(() => DefendantPlea, { nullable: true })
  readonly defendantPlea?: DefendantPlea

  @Allow()
  @Field(() => ServiceRequirement, { nullable: true })
  readonly serviceRequirement?: ServiceRequirement
}
