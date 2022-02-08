import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryRealEstateAddress {
  @Field(() => String, { nullable: true })
  streetName?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: number | null

  @Field(() => String, { nullable: true })
  city?: string | null

  // @Field(() => String, { nullable: true })
  // municipalityCode?: string | null
}
