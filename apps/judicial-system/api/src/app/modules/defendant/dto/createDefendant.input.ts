import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { Gender } from '@island.is/judicial-system/types'

@InputType()
export class CreateDefendantInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly noNationalId?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly nationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly name?: string

  @Allow()
  @Field(() => Gender, { nullable: true })
  readonly gender?: Gender

  @Allow()
  @Field({ nullable: true })
  readonly address?: string

  @Allow()
  @Field({ nullable: true })
  readonly citizenship?: string
}
