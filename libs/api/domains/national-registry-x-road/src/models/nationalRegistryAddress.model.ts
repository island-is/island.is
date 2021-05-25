import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryAddress {
  @Field(() => String)
  streetName?: string

  @Field(() => String)
  postalCode?: string

  @Field(() => String)
  city?: string
}
