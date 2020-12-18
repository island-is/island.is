import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Address {
  @Field(() => String)
  streetAddress!: string

  @Field(() => String)
  postalCode!: string

  @Field(() => String)
  city!: string
}
