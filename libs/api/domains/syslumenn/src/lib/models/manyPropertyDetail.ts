import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
class RealEstateDetail {
  @Field({ nullable: true })
  propertyNumber?: string

  @Field({ nullable: true })
  usage?: string

  @Field({ nullable: true })
  defaultAddress?: string
}

@ObjectType()
class VehicleDetail {
  @Field({ nullable: true })
  licencePlate?: string

  @Field({ nullable: true })
  propertyNumber?: string

  @Field({ nullable: true })
  manufacturer?: string

  @Field({ nullable: true })
  manufacturerType?: string

  @Field({ nullable: true })
  color?: string

  @Field({ nullable: true })
  dateOfRegistration?: Date
}

@ObjectType()
class ShipMeasurements {
  @Field({ nullable: true })
  length?: string

  @Field({ nullable: true })
  bruttoWeightTons?: string
}

@ObjectType()
class ShipDetail {
  @Field({ nullable: true })
  shipRegistrationNumber?: string

  @Field({ nullable: true })
  usageType?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  initialRegistrationDate?: Date

  @CacheField(() => ShipMeasurements, { nullable: true })
  mainMeasurements?: ShipMeasurements
}

@ObjectType()
export class ManyPropertyDetail {
  @Field({ nullable: true })
  propertyNumber?: string

  @Field({ nullable: true })
  propertyType?: string

  @CacheField(() => [RealEstateDetail], { nullable: true })
  realEstate?: RealEstateDetail[]

  @CacheField(() => VehicleDetail, { nullable: true })
  vehicle?: VehicleDetail

  @CacheField(() => ShipDetail, { nullable: true })
  ship?: ShipDetail
}
