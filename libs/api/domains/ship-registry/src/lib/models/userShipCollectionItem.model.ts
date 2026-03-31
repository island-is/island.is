import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySeaworthiness } from './seaworthiness.model'

@ObjectType('ShipRegistryUserShipCollectionItem')
export class UserShipCollectionItem {
  @Field(() => Int)
  registrationNumber!: number

  @Field()
  name!: string

  @Field({ nullable: true })
  regionAcronym?: string

  @Field(() => ShipRegistrySeaworthiness, { nullable: true })
  seaworthiness?: ShipRegistrySeaworthiness
}
