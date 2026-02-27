import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySeaworthiness } from './seaworthiness.model'
import { ShipRegistryIdentification } from './identification.model'
import { ShipRegistryMeasurements } from './measurements.model'
import { ShipRegistryFishery } from './fishery.model'
import { ShipRegistryEngine } from './engine.model'

@ObjectType('ShipRegistryUserShip')
export class UserShip {
  @Field(() => ID)
  id!: string

  @Field(() => Int)
  registrationNumber!: number

  @Field()
  name!: string

  @Field({ nullable: true })
  usageType?: string

  @Field({ nullable: true })
  imoNumber?: string

  @Field({ nullable: true })
  status?: string

  @Field(() => Int, { nullable: true })
  constructionYear?: number

  @Field({ nullable: true })
  constructionStation?: string

  @Field({ nullable: true })
  constructionPlace?: string

  @Field({ nullable: true })
  hullMaterial?: string

  @Field({ nullable: true })
  classificationSociety?: string

  @Field(() => ShipRegistrySeaworthiness, { nullable: true })
  seaworthiness?: ShipRegistrySeaworthiness

  @Field(() => ShipRegistryIdentification, { nullable: true })
  identification?: ShipRegistryIdentification

  @Field(() => ShipRegistryMeasurements, { nullable: true })
  measurements?: ShipRegistryMeasurements

  @Field(() => ShipRegistryFishery, { nullable: true })
  fishery?: ShipRegistryFishery

  @Field(() => [ShipRegistryEngine], { nullable: true })
  engines?: ShipRegistryEngine[]
}
