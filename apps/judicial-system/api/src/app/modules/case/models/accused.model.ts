import { Field, ObjectType } from '@nestjs/graphql'

import {
  Accused as TAccused,
  CaseGender,
} from '@island.is/judicial-system/types'

@ObjectType()
export class Accused implements TAccused {
  @Field()
  readonly nationalId!: string

  @Field({ nullable: true })
  readonly name?: string

  @Field({ nullable: true })
  readonly address?: string

  @Field(() => String, { nullable: true })
  readonly gender?: CaseGender
}
