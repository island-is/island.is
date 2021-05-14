import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeaveUnion {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}
