import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  AccusedInput as TAccused,
  CaseGender,
} from '@island.is/judicial-system/types'

@InputType()
export class AccusedInput implements TAccused {
  @Allow()
  @Field()
  readonly nationalId!: string

  @Allow()
  @Field({ nullable: true })
  readonly name?: string

  @Allow()
  @Field({ nullable: true })
  readonly address?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly gender?: CaseGender
}
