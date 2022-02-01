import { Field, ObjectType, ID } from '@nestjs/graphql'
@ObjectType()
export class NationalRegistryRealEstateRealEstate {
  @Field(() => String, { nullable: true })
  realEstateNumber?: string | null
}
