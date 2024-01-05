import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryXRoadAddress')
export class NationalRegistryAddress {
  @Field(() => String)
  streetName!: string

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null
}
