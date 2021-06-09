import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesUnion {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}
