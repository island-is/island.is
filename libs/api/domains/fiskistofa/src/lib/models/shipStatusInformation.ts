import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class FiskistofaShip {
  @Field()
  id!: string

  @Field({ nullable: true })
  shipNumber?: number

  @Field()
  name!: string

  @Field()
  timePeriod!: string
}

@ObjectType()
class FiskistofaCatchQuotaCategory {
  @Field({ nullable: true })
  id?: number
  @Field()
  name!: string
  @Field({ nullable: true })
  allocation?: number
  @Field({ nullable: true })
  specialAlloction?: number
  @Field({ nullable: true })
  betweenYears?: number
  @Field({ nullable: true })
  betweenShips?: number
  @Field({ nullable: true })
  catchQuota?: number
  @Field({ nullable: true })
  catch?: number
  @Field({ nullable: true })
  status?: number
  @Field({ nullable: true })
  displacement?: number
  @Field({ nullable: true })
  newStatus?: number
  @Field({ nullable: true })
  nextYear?: number
  @Field({ nullable: true })
  excessCatch?: number
  @Field({ nullable: true })
  unused?: number
  @Field({ nullable: true })
  codEquivalent?: number
}

@ObjectType()
class FiskistofaExtendedCatchQuotaCategory extends FiskistofaCatchQuotaCategory {
  @Field({ nullable: true })
  totalCatchQuota?: number
  @Field({ nullable: true })
  quotaShare?: number
  @Field({ nullable: true })
  nextYearQuota?: number
  @Field({ nullable: true })
  nextYearFromQuota?: number
  @Field({ nullable: true })
  percentNextYearQuota?: number
  @Field({ nullable: true })
  percentNextYearFromQuota?: number
  @Field({ nullable: true })
  allocatedCatchQuota?: number
}

@ObjectType()
class FiskistofaShipStatusInformation {
  @CacheField(() => FiskistofaShip, { nullable: true })
  shipInformation?: FiskistofaShip

  @CacheField(() => [FiskistofaCatchQuotaCategory], { nullable: true })
  catchQuotaCategories?: FiskistofaCatchQuotaCategory[]
}

@ObjectType()
export class FiskistofaShipStatusInformationResponse {
  @CacheField(() => FiskistofaShipStatusInformation, { nullable: true })
  fiskistofaShipStatus?: FiskistofaShipStatusInformation | null
}

@ObjectType()
class FiskistofaExtendedShipStatusInformation {
  @CacheField(() => FiskistofaShip, { nullable: true })
  shipInformation?: FiskistofaShip

  @CacheField(() => [FiskistofaExtendedCatchQuotaCategory], { nullable: true })
  catchQuotaCategories?: FiskistofaExtendedCatchQuotaCategory[]
}

@ObjectType()
export class FiskistofaExtendedShipStatusInformationResponse {
  @CacheField(() => FiskistofaExtendedShipStatusInformation, { nullable: true })
  fiskistofaShipStatus?: FiskistofaExtendedShipStatusInformation | null
}

@ObjectType()
class FiskistofaExtendedShipStatusInformationUpdate {
  @CacheField(() => FiskistofaShip, { nullable: true })
  shipInformation?: FiskistofaShip

  @CacheField(() => [FiskistofaCatchQuotaCategory], { nullable: true })
  catchQuotaCategories?: FiskistofaCatchQuotaCategory[]
}

@ObjectType()
export class FiskistofaExtendedShipStatusInformationUpdateResponse {
  @CacheField(() => FiskistofaExtendedShipStatusInformationUpdate, {
    nullable: true,
  })
  fiskistofaShipStatus?: FiskistofaExtendedShipStatusInformationUpdate | null
}
