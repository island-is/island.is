import { Field, ObjectType } from '@nestjs/graphql'
import { VehicleMileageDetail } from './getVehicleMileage.model'

@ObjectType()
export class VehiclesMainInfo {
  @Field(() => String, { nullable: true })
  model?: string | null

  @Field(() => String, { nullable: true })
  subModel?: string | null

  @Field(() => String, { nullable: true })
  regno?: string | null

  @Field(() => Number, { nullable: true })
  year?: number | null

  @Field(() => Number, { nullable: true })
  co2?: number | null

  @Field(() => Number, { nullable: true })
  weightedCo2?: number | null

  @Field(() => Number, { nullable: true })
  co2Wltp?: number | null

  @Field(() => Number, { nullable: true })
  weightedCo2Wltp?: number | null

  @Field(() => Number, { nullable: true })
  cubicCapacity?: number | null

  @Field(() => Number, { nullable: true })
  trailerWithBrakesWeight?: number | null

  @Field(() => Number, { nullable: true })
  trailerWithoutBrakesWeight?: number | null

  @Field(() => Date, { nullable: true })
  nextAvailableMileageReadDate?: Date | null

  @Field(() => Boolean, { nullable: true })
  requiresMileageRegistration?: boolean | null

  @Field(() => Boolean, { nullable: true })
  canRegisterMileage?: boolean | null

  @Field(() => Boolean, { nullable: true })
  availableMileageRegistration?: boolean
}

@ObjectType()
export class VehiclesAxle {
  @Field(() => Number, { nullable: true })
  axleMaxWeight?: number | null

  @Field(() => String, { nullable: true })
  wheelAxle?: string | null
}

@ObjectType()
export class Tyres {
  @Field(() => String, { nullable: true })
  axle1?: string | null

  @Field(() => String, { nullable: true })
  axle2?: string | null

  @Field(() => String, { nullable: true })
  axle3?: string | null

  @Field(() => String, { nullable: true })
  axle4?: string | null

  @Field(() => String, { nullable: true })
  axle5?: string | null
}

@ObjectType()
export class VehiclesBasicInfo {
  @Field(() => String, { nullable: true })
  model?: string | null

  @Field(() => String, { nullable: true })
  regno?: string | null

  @Field(() => String, { nullable: true })
  subModel?: string | null

  @Field(() => String, { nullable: true })
  permno?: string | null

  @Field(() => String, { nullable: true })
  verno?: string | null

  @Field(() => Number, { nullable: true })
  year?: number | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field(() => String, { nullable: true })
  preregDateYear?: string | null

  @Field(() => String, { nullable: true })
  formerCountry?: string | null

  @Field(() => String, { nullable: true })
  importStatus?: string | null

  @Field(() => String, { nullable: true })
  vehicleStatus?: string | null
}

@ObjectType()
export class VehiclesRegistrationInfo {
  @Field(() => Date, { nullable: true })
  firstRegistrationDate?: Date | null

  @Field(() => Date, { nullable: true })
  preRegistrationDate?: Date | null

  @Field(() => Date, { nullable: true })
  newRegistrationDate?: Date | null

  @Field(() => String, { nullable: true })
  specialName?: string | null

  @Field(() => String, { nullable: true })
  vehicleGroup?: string | null

  @Field(() => String, { nullable: true })
  color?: string | null

  @Field(() => String, { nullable: true })
  reggroup?: string | null

  @Field(() => String, { nullable: true })
  reggroupName?: string | null

  @Field(() => String, { nullable: true })
  plateLocation?: string | null

  @Field(() => String, { nullable: true })
  plateStatus?: string | null

  @Field(() => Number, { nullable: true })
  passengers?: number | null

  @Field(() => String, { nullable: true })
  useGroup?: string | null

  @Field(() => Number, { nullable: true })
  driversPassengers?: number | null

  @Field(() => Number, { nullable: true })
  standingPassengers?: number | null

  @Field(() => String, { nullable: true })
  plateTypeFront?: string | null

  @Field(() => String, { nullable: true })
  plateTypeRear?: string | null
}

@ObjectType()
export class VehiclesCurrentOwnerInfo {
  @Field(() => String, { nullable: true })
  owner?: string | null

  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  postalcode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => Date, { nullable: true })
  dateOfPurchase?: Date | null
}

@ObjectType()
export class VehiclesInspectionInfo {
  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => String, { nullable: true })
  result?: string | null

  @Field(() => String, { nullable: true })
  odometer?: string | null

  @Field(() => Date, { nullable: true })
  nextInspectionDate?: Date | null

  @Field(() => Date, { nullable: true })
  lastInspectionDate?: Date | null

  @Field(() => Boolean, { nullable: true })
  insuranceStatus?: boolean | null

  @Field(() => Number, { nullable: true })
  mortages?: number | null

  @Field(() => Number, { nullable: true })
  carTax?: number | null

  @Field(() => Number, { nullable: true })
  inspectionFine?: number | null
}

@ObjectType()
export class VehiclesTechnicalInfo {
  @Field(() => String, { nullable: true })
  engine?: string | null

  @Field(() => String, { nullable: true })
  totalWeight?: number | null

  @Field(() => String, { nullable: true })
  cubicCapacity?: number | null

  @Field(() => Number, { nullable: true })
  capacityWeight?: number | null

  @Field(() => Number, { nullable: true })
  length?: number | null

  @Field(() => Number, { nullable: true })
  vehicleWeight?: number | null

  @Field(() => Number, { nullable: true })
  width?: number | null

  @Field(() => Number, { nullable: true })
  trailerWithoutBrakesWeight?: number | null

  @Field(() => Number, { nullable: true })
  horsepower?: number | null

  @Field(() => Number, { nullable: true })
  trailerWithBrakesWeight?: number | null

  @Field(() => Number, { nullable: true })
  carryingCapacity?: number | null

  @Field(() => Number, { nullable: true })
  axleTotalWeight?: number | null

  @Field(() => [VehiclesAxle], { nullable: true })
  axles?: VehiclesAxle[]

  @Field(() => Tyres, { nullable: true })
  tyres?: Tyres
}

@ObjectType()
export class VehiclesOwners {
  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => Date)
  dateOfPurchase?: Date

  @Field(() => Boolean, { nullable: true })
  current?: boolean
}

@ObjectType()
export class VehiclesOperator {
  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  postalcode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => Date, { nullable: true })
  startDate?: Date | null

  @Field(() => Date, { nullable: true })
  endDate?: Date | null

  @Field(() => Number, { nullable: true })
  serial?: number | null

  @Field(() => Boolean, { nullable: true })
  mainOperator?: boolean | null

  @Field(() => Boolean, {
    nullable: true,
    description: 'Deprecated. Keeping in for now for backward compatibility.',
  })
  mainoperator?: boolean | null
}

@ObjectType()
export class VehiclesDetail {
  @Field(() => VehiclesMainInfo, { nullable: true })
  mainInfo?: VehiclesMainInfo

  @Field(() => VehiclesBasicInfo, { nullable: true })
  basicInfo?: VehiclesBasicInfo

  @Field(() => VehiclesRegistrationInfo, { nullable: true })
  registrationInfo?: VehiclesRegistrationInfo

  @Field(() => VehiclesCurrentOwnerInfo, { nullable: true })
  currentOwnerInfo?: VehiclesCurrentOwnerInfo

  @Field(() => VehiclesInspectionInfo, { nullable: true })
  inspectionInfo?: VehiclesInspectionInfo

  @Field(() => VehiclesTechnicalInfo, { nullable: true })
  technicalInfo?: VehiclesTechnicalInfo

  @Field(() => [VehiclesOwners], { nullable: true })
  ownersInfo?: VehiclesOwners[]

  @Field(() => [VehiclesCurrentOwnerInfo], { nullable: true })
  coOwners?: VehiclesCurrentOwnerInfo[]

  @Field(() => [VehiclesOperator], { nullable: true })
  operators?: VehiclesOperator[]

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string

  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => Boolean, { nullable: true })
  isOutOfCommission?: boolean

  @Field(() => VehicleMileageDetail, { nullable: true })
  lastMileage?: VehicleMileageDetail | null
}

@ObjectType()
export class VehiclesExcel {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  persidno?: string

  @Field(() => [VehiclesDetail], { nullable: true })
  vehicles?: VehiclesDetail[]
}
