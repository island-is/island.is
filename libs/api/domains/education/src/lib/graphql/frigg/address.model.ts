import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType() // Explicitly mark this class as a GraphQL type
export class AddressModel {
  @Field({ nullable: true })
  street?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  country?: string

  @Field({ nullable: true })
  municipality?: string
}
