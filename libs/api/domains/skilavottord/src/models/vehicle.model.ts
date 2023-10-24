import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Vehicle {
  @Field(() => String)
  permno!: string

  @Field(() => ID)
  type!: string

  @Field(() => String)
  color!: string

  @Field(() => String)
  vinNumber!: string

  @Field(() => String)
  firstRegDate!: string

  @Field(() => String)
  isRecyclable!: string

  @Field(() => String)
  hasCoOwner!: string

  @Field(() => String)
  status!: string
}
