import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { Gender, UpdateDefendant } from '@island.is/judicial-system/types'

@InputType()
export class UpdateDefendantInput implements UpdateDefendant {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly defendantId!: string

  @Allow()
  @Field({ nullable: true })
  readonly noNationalId?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly nationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly name?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly gender?: Gender

  @Allow()
  @Field({ nullable: true })
  readonly address?: string

  @Allow()
  @Field({ nullable: true })
  readonly citizenship?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly defendantWaivesRightToCounsel?: boolean
}
