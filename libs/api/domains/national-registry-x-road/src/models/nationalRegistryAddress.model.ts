import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryAddress {
  @Field(() => String)
  streetName?: string

  @Field(() => String, { nullable: true })
  postalCode?: string

  @Field(() => String)
  city?: string
}
