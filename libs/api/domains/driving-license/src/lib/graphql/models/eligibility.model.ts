import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Eligibility {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  issued!: string

  @Field(() => String)
  expires!: string

  @Field(() => String)
  comment!: string
}
