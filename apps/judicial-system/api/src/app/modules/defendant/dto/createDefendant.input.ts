import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { Gender, CreateDefendant } from '@island.is/judicial-system/types'

@InputType()
export class CreateDefendantInput implements CreateDefendant {
  @Allow()
  @Field()
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
}
