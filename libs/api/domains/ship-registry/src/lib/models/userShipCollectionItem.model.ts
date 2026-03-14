import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySeaworthiness } from './seaworthiness.model'

@ObjectType('ShipRegistryUserShipCollectionItem')
export class UserShipCollectionItem {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  regionAcronym?: string

  @Field(() => ShipRegistrySeaworthiness, { nullable: true })
  seaworthiness?: ShipRegistrySeaworthiness
}
