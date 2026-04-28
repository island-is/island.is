import { ObjectType, Field } from '@nestjs/graphql'
import { LandRegistryEntryProperty } from './landRegistryEntryProperty.model'

@ObjectType('FarmerLandRegistryEntry')
export class LandRegistryEntry {
  @Field()
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  ownerName?: string

  @Field({ nullable: true })
  ownerNationalId?: string

  @Field(() => [LandRegistryEntryProperty], { nullable: true })
  properties?: LandRegistryEntryProperty[]
}
