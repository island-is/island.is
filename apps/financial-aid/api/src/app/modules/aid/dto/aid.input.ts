import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class AidInput {
  @Allow()
  @Field()
  readonly ownPlace!: number

  @Allow()
  @Field()
  readonly registeredRenting!: number

  @Allow()
  @Field()
  readonly unregisteredRenting!: number

  @Allow()
  @Field()
  readonly livesWithParents!: number

  @Allow()
  @Field()
  readonly unknown!: number

  @Allow()
  @Field()
  readonly withOthers!: number

  @Allow()
  @Field(() => String)
  readonly type!: number
}
