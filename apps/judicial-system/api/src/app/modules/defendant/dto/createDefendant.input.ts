import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { CreateDefendant, Gender } from '@island.is/judicial-system/types'

@InputType()
export class CreateDefendantInput implements CreateDefendant {
  @Allow()
  @Field()
  readonly caseId!: string

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
}
