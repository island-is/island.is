import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryAddress')
export class Address {
  // Not available in V3 API
  @Field(() => ID, { nullable: true })
  code?: string | null

  // Not available in V3 API
  @Field(() => String, { nullable: true })
  lastUpdated?: string | null

  @Field(() => String, { nullable: true })
  streetAddress?: string | null

  @Field(() => String, { nullable: true })
  apartment?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  municipalityText?: string | null
}
