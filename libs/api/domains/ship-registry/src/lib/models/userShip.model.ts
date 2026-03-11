import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { ShipRegistryLocalizedValue } from './localizedValue.model'
import { ShipRegistryMeasurements } from './measurements.model'
import { ShipRegistryFishery } from './fishery.model'
import { ShipRegistryEngine } from './engine.model'
import { ShipRegistryCertificate } from './certificate.model'

@ObjectType('ShipRegistryUserShip')
export class UserShip {
  @Field(() => ID)
  id!: string

  @Field(() => Int)
  registrationNumber!: number

  @Field()
  name!: string

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  region?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  usageType?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, {
    nullable: true,
    description: 'International Maritime Organization number',
  })
  imoNumber?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  phoneOnBoard?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  constructionYear?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  constructionStation?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  hullMaterial?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  classificationSociety?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryMeasurements, { nullable: true })
  measurements?: ShipRegistryMeasurements

  @Field(() => ShipRegistryFishery, { nullable: true })
  fishery?: ShipRegistryFishery

  @Field(() => [ShipRegistryEngine], { nullable: true })
  engines?: ShipRegistryEngine[]

  @Field(() => [ShipRegistryCertificate], { nullable: true })
  certificates?: ShipRegistryCertificate[]
}
