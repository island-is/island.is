import { EinstaklingurDTOHeimili } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryAddress {
  @Field(() => String)
  streetName!: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  municipalityText?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null
}
