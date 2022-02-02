import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryRealEstateRealEstate } from './nationalRegistryRealEstateRealEstate.model'

@ObjectType()
export class NationalRegistryRealEstateResult {
  @Field(() => [NationalRegistryRealEstateRealEstate], { nullable: true })
  realEstates?: NationalRegistryRealEstateRealEstate[]
}
