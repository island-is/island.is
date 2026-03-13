import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType('FarmerLandRegistryEntryProperty')
export class LandRegistryEntryProperty {
  @Field()
  ownershipType!: string

  @Field()
  usage!: string

  @Field(() => Float, { nullable: true })
  share?: number
}
