import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class TestInput {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly id2!: string

  @Allow()
  @Field()
  readonly id3!: string

  @Allow()
  @Field()
  readonly id4!: string

  @Allow()
  @Field()
  readonly id5!: string

  @Allow()
  @Field()
  readonly id6!: string

  @Allow()
  @Field()
  readonly id7!: string
}
