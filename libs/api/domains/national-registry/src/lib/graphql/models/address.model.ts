import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Address {
  @Field(() => ID)
  code!: string

  @Field(() => String)
  lastUpdated!: string

  @Field(() => String)
  streetAddress!: string

  @Field(() => String)
  city!: string

  @Field(() => String)
  postalCode!: string
}
