import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NextInspection {
  @Field(() => Date, { name: 'nextInspectionDate', nullable: true })
  nextinspectiondate?: Date

  @Field(() => Date, {
    name: 'nextInspectionDateIfPassedInspectionToday',
    nullable: true,
  })
  nextinspectiondateIfPassedInspectionToday?: Date
}
@ObjectType()
export class VehiclesVehicle {
  @Field({ nullable: true })
  isCurrent?: boolean

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
  firstRegDate?: Date

  @Field({ nullable: true })
  modelYear?: string

  @Field({ nullable: true })
  productYear?: string

  @Field({ nullable: true })
  registrationType?: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  operatorStartDate?: Date

  @Field({ nullable: true })
  operatorEndDate?: Date

  @Field({ nullable: true })
  outOfUse?: boolean

  @Field({ nullable: true })
  otherOwners?: boolean

  @Field({ nullable: true })
  termination?: string

  @Field({ nullable: true })
  buyerPersidno?: string

  @Field({ nullable: true })
  ownerPersidno?: string

  @Field({ nullable: true })
  vehicleStatus?: string

  @Field({ nullable: true })
  useGroup?: string

  @Field({ nullable: true })
  vehGroup?: string

  @Field({ nullable: true })
  plateStatus?: string

  @Field({ nullable: true })
  nextInspection?: NextInspection

  @Field({ nullable: true })
  deregistrationDate?: Date

  @Field({ nullable: true, defaultValue: null })
  operatorNumber?: number

  @Field({ nullable: true, defaultValue: null })
  primaryOperator?: boolean

  @Field({ nullable: true, defaultValue: null })
  ownerSsid?: string

  @Field({ nullable: true, defaultValue: null })
  ownerName?: string

  @Field({ nullable: true, defaultValue: null })
  lastInspectionResult?: string

  @Field({ nullable: true, defaultValue: null })
  lastInspectionDate?: Date

  @Field({ nullable: true, defaultValue: null })
  lastInspectionType?: string

  @Field({ nullable: true, defaultValue: null })
  nextInspectionDate?: Date
}

@ObjectType()
export class VehiclesHistory {
  @Field({ nullable: true })
  persidno?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  postStation?: string

  @Field(() => [VehiclesVehicle], { nullable: true })
  vehicleList?: VehiclesVehicle[]

  @Field({ nullable: true })
  createdTimestamp?: string
}

@ObjectType()
export class VehiclesList {
  @Field({ nullable: true })
  persidno?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  postStation?: string

  @Field(() => [VehiclesVehicle], { nullable: true })
  vehicleList?: VehiclesVehicle[]

  @Field({ nullable: true })
  createdTimestamp?: string

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string

  @Field({ nullable: true })
  nextCursor?: string
}
