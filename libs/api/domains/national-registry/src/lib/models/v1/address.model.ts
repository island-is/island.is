import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Address {
  @Field(() => ID)
  code!: string

  @Field(() => String, { nullable: true })
  lastUpdated?: string

  @Field(() => String, { nullable: true })
  streetAddress?: string

  @Field(() => String)
  city!: string

  @Field(() => String, { nullable: true })
  postalCode?: string
}
