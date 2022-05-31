import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesMainInfo {
  @Field(() => String, { nullable: true })
  model?: string | null

  @Field(() => String, { nullable: true })
  subModel?: string | null // vehcom + speccom

  @Field(() => String, { nullable: true })
  regno?: string | null

  @Field(() => Number, { nullable: true })
  year?: number | null // modelYear || currentYear ?? null

  @Field(() => Number, { nullable: true })
  co2?: number | null // NEDC

  @Field(() => Number, { nullable: true })
  weightedCo2?: number | null // Weighted NEDC

  @Field(() => Number, { nullable: true })
  co2Wltp?: number | null // WLTP

  @Field(() => Number, { nullable: true })
  weightedco2Wltp?: number | null // Weighted WLTP

  @Field(() => Number, { nullable: true })
  cubicCapacity?: number | null // Slagrými ?? technical -> capacity

  @Field(() => Number, { nullable: true })
  trailerWithBrakesWeight?: number | null // technical -> mass -> tMassoftrbr

  @Field(() => Number, { nullable: true })
  trailerWithoutBrakesWeight?: number | null // technical -> tMassoftrunbr
}

@ObjectType()
export class VehiclesAxle {
  @Field(() => Number, { nullable: true })
  axleMaxWeight?: number | null // technical -> mass -> `massdaxle${i}` ??

  @Field(() => String, { nullable: true })
  wheelAxle?: string | null // technical -> axle -> `wheelaxle${i}`
}

@ObjectType()
export class Tyres {
  @Field(() => String, { nullable: true })
  axle1?: string | null // technical -> tyre -> `tyreaxle1`

  @Field(() => String, { nullable: true })
  axle2?: string | null // technical -> tyre -> `tyreaxle2`

  @Field(() => String, { nullable: true })
  axle3?: string | null // technical -> tyre -> `tyreaxle3`

  @Field(() => String, { nullable: true })
  axle4?: string | null // technical -> tyre -> `tyreaxle4`

  @Field(() => String, { nullable: true })
  axle5?: string | null // technical -> tyre -> `tyreaxle5`
}

@ObjectType()
export class VehiclesBasicInfo {
  @Field(() => String, { nullable: true })
  model?: string | null // make

  @Field(() => String, { nullable: true })
  regno?: string | null // regno

  @Field(() => String, { nullable: true })
  subModel?: string | null // vehcom + speccom

  @Field(() => String, { nullable: true })
  permno?: string | null // permno // fastanúmer

  @Field(() => String, { nullable: true })
  verno?: string | null // vin // verksmiðjunúmer

  @Field(() => Number, { nullable: true })
  year?: number | null // modelYear || currentYear ?? null

  @Field(() => String, { nullable: true })
  country?: string | null // country

  @Field(() => String, { nullable: true })
  preregDateYear?: string | null // preregdate -> year

  @Field(() => String, { nullable: true })
  formerCountry?: string | null // formercountry

  @Field(() => String, { nullable: true })
  importStatus?: string | null // import
}

@ObjectType()
export class VehiclesRegistrationInfo {
  @Field(() => String, { nullable: true })
  firstRegistrationDate?: string | null // firstregdate

  @Field(() => String, { nullable: true })
  preRegistrationDate?: string | null // preregdate

  @Field(() => String, { nullable: true })
  newRegistrationDate?: string | null // newregdate

  @Field(() => String, { nullable: true })
  specialName?: string | null // Sérheiti - speccom

  @Field(() => String, { nullable: true })
  vehicleGroup?: string | null // technical -> vehgroup // ökutækisflokkur

  @Field(() => String, { nullable: true })
  color?: string | null

  @Field(() => String, { nullable: true })
  reggroup?: string | null // Skráningarflokkur // plates -> reggroup

  @Field(() => String, { nullable: true })
  reggroupName?: string | null // Skráningarflokkur // plates -> reggroupname

  @Field(() => String, { nullable: true })
  plateLocation?: string | null // Geymslustaður plötu // plates -> reggroupname

  @Field(() => String, { nullable: true })
  plateStatus?: string | null // platestatus

  @Field(() => Number, { nullable: true })
  passengers?: number | null

  @Field(() => String, { nullable: true })
  useGroup?: string | null // usegroup

  @Field(() => Boolean, { nullable: true })
  driversPassengers?: boolean | null // passbydr

  @Field(() => Number, { nullable: true })
  standingPassengers?: number | null // standingno
}

@ObjectType()
export class VehiclesCurrentOwnerInfo {
  @Field(() => String, { nullable: true })
  owner?: string | null // owners -> current -> fullname

  @Field(() => String, { nullable: true })
  nationalId?: string | null // owners -> current -> persidno

  @Field(() => String, { nullable: true })
  address?: string | null // owners -> current -> address

  @Field(() => String, { nullable: true })
  postalcode?: string | null // owners -> current -> postalcode

  @Field(() => String, { nullable: true })
  city?: string | null // owners -> current -> city

  @Field(() => String, { nullable: true })
  dateOfPurchase?: string | null // owners -> current -> purchasedate
}

@ObjectType()
export class VehiclesInspectionInfo {
  @Field(() => String, { nullable: true })
  type?: string | null // inspections[0] -> type

  @Field(() => String, { nullable: true })
  date?: string | null // inspections[0] -> date

  @Field(() => String, { nullable: true })
  result?: string | null // inspections[0] -> result

  @Field(() => String, { nullable: true })
  nextInspectionDate?: string | null // nextinspectiondate

  @Field(() => String, { nullable: true })
  lastInspectionDate?: string | null // inspections[1] -> date // EF LENGTH > 1

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
  engine?: string | null // technical -> engine

  @Field(() => String, { nullable: true })
  totalWeight?: number | null // technical -> mass -> massladen

  @Field(() => String, { nullable: true })
  cubicCapacity?: number | null // technical -> capacity

  @Field(() => Number, { nullable: true })
  capacityWeight?: number | null // technical -> mass -> masscapacity

  @Field(() => Number, { nullable: true })
  length?: number | null // technical -> size -> length

  @Field(() => Number, { nullable: true })
  vehicleWeight?: number | null // technical -> mass -> massinro

  @Field(() => Number, { nullable: true })
  width?: number | null // technical -> size -> width

  @Field(() => Number, { nullable: true })
  trailerWithoutBrakesWeight?: number | null // technical -> tMassoftrunbr

  @Field(() => Number, { nullable: true })
  horsepower?: number | null // maxNetPower * 1.359622 // Metric horsepower (hp(M))

  @Field(() => Number, { nullable: true })
  trailerWithBrakesWeight?: number | null // technical -> mass -> tMassoftrbr

  @Field(() => Number, { nullable: true })
  carryingCapacity?: number | null // technical -> mass -> masscapacity

  @Field(() => Number, { nullable: true })
  axleTotalWeight?: number | null // technical -> mass -> // massmaxle1 + massmaxle2 + massmaxle3 + massmaxle4 + massmaxle5

  @Field(() => [VehiclesAxle], { nullable: true })
  axles?: VehiclesAxle[]

  @Field(() => Tyres, { nullable: true })
  tyres?: Tyres
}

@ObjectType()
export class VehiclesOwners {
  @Field(() => String, { nullable: true })
  nationalId?: string | null // owners -> persidno

  @Field(() => String, { nullable: true })
  name?: string | null // owners -> name

  @Field(() => String, { nullable: true })
  address?: string | null // owners -> address + city

  @Field(() => String, { nullable: true })
  dateOfPurchase?: string | null // owners -> purchasedate
}

@ObjectType()
export class VehiclesOperator {
  @Field(() => String, { nullable: true })
  nationalId?: string | null // owners -> persidno

  @Field(() => String, { nullable: true })
  name?: string | null // owners -> name

  @Field(() => String, { nullable: true })
  address?: string | null // owners -> address + city

  @Field(() => String, { nullable: true })
  postalcode?: string | null // owners -> address + city

  @Field(() => String, { nullable: true })
  city?: string | null // owners -> address + city

  @Field(() => String, { nullable: true })
  startDate?: string | null // owners -> coOwner(current) -> startdate

  @Field(() => String, { nullable: true })
  endDate?: string | null // owners -> coOwner(current) -> enddate
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
}
