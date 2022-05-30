import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NextInspection {
  @Field({ nullable: true })
  nextinspectiondate?: string

  @Field({ nullable: true })
  nextinspectiondateIfPassedInspectionToday?: string
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
  firstRegDate?: string

  @Field({ nullable: true })
  modelYear?: string

  @Field({ nullable: true })
  productYear?: string

  @Field({ nullable: true })
  registrationType?: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  operatorStartDate?: string

  @Field({ nullable: true })
  operatorEndDate?: string

  @Field({ nullable: true })
  outOfUse?: boolean

  @Field({ nullable: true })
  otherOwners?: boolean

  @Field({ nullable: true })
  termination?: boolean

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
}
