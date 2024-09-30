import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesVehicleSearchNextInspection {
  @Field({ nullable: true })
  nextinspectiondate?: Date

  @Field({ nullable: true })
  nextinspectiondateIfPassedInspectionToday?: Date
}

@ObjectType()
export class VehiclesVehicleSearch {
  @Field({ nullable: true })
  permno?: string

  @Field({ nullable: true })
  regno?: string

  @Field({ nullable: true })
  vin?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  color?: string

  @Field({ nullable: true })
  firstregdate?: Date

  @Field({ nullable: true })
  latestregistration?: string

  @Field(() => VehiclesVehicleSearchNextInspection, { nullable: true })
  nextInspection?: VehiclesVehicleSearchNextInspection

  @Field({ nullable: true })
  currentOwner?: string

  @Field({ nullable: true })
  currentOwnerAddress?: string

  @Field({ nullable: true })
  currentOwnerIsAnonymous?: boolean

  @Field({ nullable: true })
  useGroup?: string

  @Field({ nullable: true })
  regtype?: string

  @Field({ nullable: true })
  mass?: number

  @Field({ nullable: true })
  massLaden?: number

  @Field({ nullable: true })
  vehicleStatus?: string

  @Field({ nullable: true })
  co?: number

  @Field({ nullable: true })
  co2Wltp?: number

  @Field({ nullable: true })
  weightedco2Wltp?: number

  @Field(() => Date, { nullable: true })
  nextAvailableMileageReadDate?: Date | null

  @Field(() => Boolean, { nullable: true })
  requiresMileageRegistration?: boolean | null

  @Field(() => Boolean, { nullable: true })
  canRegisterMileage?: boolean | null
}
