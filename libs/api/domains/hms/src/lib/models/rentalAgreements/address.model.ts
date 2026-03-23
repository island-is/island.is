import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsAddress')
export class Address {
  @Field({ nullable: true })
  streetAddress?: string

  @Field({ nullable: true })
  city?: string

  @Field(() => Int, { nullable: true })
  postalCode?: number

  @Field({ nullable: true })
  country?: string
}
