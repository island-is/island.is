import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType('FarmerLandRegistryEntryProperty')
export class LandRegistryEntryProperty {
  @Field({ nullable: true })
  ownershipType?: string

  @Field({ nullable: true })
  usage?: string

  @Field(() => Float, { nullable: true })
  share?: number
}
