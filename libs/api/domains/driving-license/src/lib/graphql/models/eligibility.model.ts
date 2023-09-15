import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Eligibility {
  @Field(() => ID)
  name!: string

  @Field(() => Date)
  issued!: Date

  @Field(() => Date)
  expires!: Date

  @Field(() => String)
  comment!: string
}
