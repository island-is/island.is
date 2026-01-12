import { Field, ObjectType } from '@nestjs/graphql'
import { VehicleMileageDetail } from './getVehicleMileage.model'
import { DownloadServiceUrls } from './vehiclesDownloadServiceUrls.model'

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

  @Field(() => Date, { nullable: true })
  nextAvailableMileageReadDate?: Date | null

  @Field(() => Boolean, { nullable: true })
  requiresMileageRegistration?: boolean | null

  @Field(() => Boolean, { nullable: true })
  canRegisterMileage?: boolean | null
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
export class VehiclePaging {
  @Field({ nullable: true })
  pageNumber?: number

  @Field({ nullable: true })
  pageSize?: number

  @Field({ nullable: true })
  totalPages?: number

  @Field({ nullable: true })
  totalRecords?: number
}

@ObjectType()
export class VehiclesList {
  @Field(() => [VehiclesVehicle], {
    nullable: true,
    deprecationReason: 'Too slow. Use VehiclesListV2 when possible.',
  })
  vehicleList?: VehiclesVehicle[]

  @Field({ nullable: true })
  paging?: VehiclePaging

  @Field({
    nullable: true,
    deprecationReason: 'New service does not include this field',
  })
  postStation?: string

  @Field(() => DownloadServiceUrls, { nullable: true })
  downloadServiceUrls?: DownloadServiceUrls

  @Field({
    nullable: true,
    deprecationReason: 'New service does not include this field',
  })
  persidno?: string

  @Field({
    nullable: true,
    deprecationReason: 'New service does not include this field',
  })
  name?: string

  @Field({
    nullable: true,
    deprecationReason: 'New service does not include this field',
  })
  address?: string

  @Field({
    nullable: true,
    deprecationReason: 'New service does not include this field',
  })
  createdTimestamp?: string
}

@ObjectType()
export class VehicleListed {
  @Field({ nullable: true })
  permno?: string

  @Field({ nullable: true })
  regno?: string

  @Field({ nullable: true })
  persidno?: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  make?: string

  @Field({ nullable: true })
  colorCode?: string

  @Field({ nullable: true })
  colorName?: string

  @Field({ nullable: true })
  modelYear?: string

  @Field(() => Boolean, { nullable: true })
  requiresMileageRegistration?: boolean | null

  @Field(() => Boolean, { nullable: true })
  canRegisterMileage?: boolean | null

  @Field({ nullable: true })
  regTypeCode?: string

  @Field({ nullable: true })
  regTypeName?: string

  @Field({ nullable: true })
  regTypeSubName?: string

  @Field({ nullable: true })
  nextMainInspection?: Date

  @Field(() => VehicleMileageDetail, { nullable: true })
  lastMileageRegistration?: VehicleMileageDetail

  @Field(() => [VehicleMileageDetail], { nullable: true })
  mileageRegistrationHistory?: Array<VehicleMileageDetail>

  @Field({ nullable: true })
  latestMileage?: number

  @Field({ nullable: true })
  vin?: string
}

@ObjectType()
export class VehiclesListV2 {
  @Field(() => [VehicleListed], { nullable: true })
  vehicleList?: VehicleListed[]

  @Field({ nullable: true })
  paging?: VehiclePaging

  @Field(() => DownloadServiceUrls, { nullable: true })
  downloadServiceUrls?: DownloadServiceUrls
}
