import { ObjectType, Field } from '@nestjs/graphql'
import { LandRegistryEntryProperty } from './landRegistryEntryProperty.model'

@ObjectType('FarmerLandRegistryEntry')
export class LandRegistryEntry {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field(() => [LandRegistryEntryProperty], { nullable: true })
  properties?: LandRegistryEntryProperty[]
}
