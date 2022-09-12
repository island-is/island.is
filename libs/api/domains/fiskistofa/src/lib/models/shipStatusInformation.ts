import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Ship {
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
class AllowedCatchCategory {
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
  allowedCatch?: number
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
  totalAllowedCatch?: number
  @Field({ nullable: true })
  rateOfShare?: number
  @Field({ nullable: true })
  nextYearQuota?: number
  @Field({ nullable: true })
  nextYearFromQuota?: number
}

@ObjectType()
class ExtendedAllowedCatchCategory extends AllowedCatchCategory {
  @Field()
  totalAllowedCatch?: number
  @Field()
  rateOfShare?: number
  @Field()
  nextYearQuota?: number
  @Field()
  nextYearFromQuota?: number
}

@ObjectType()
export class ShipStatusInformation {
  @Field(() => Ship, { nullable: true })
  shipInformation?: Ship

  @Field(() => [AllowedCatchCategory], { nullable: true })
  allowedCatchCategories?: AllowedCatchCategory[]
}

@ObjectType()
export class ExtendedShipStatusInformation {
  @Field(() => Ship, { nullable: true })
  shipInformation?: Ship

  @Field(() => [ExtendedAllowedCatchCategory], { nullable: true })
  allowedCatchCategories?: ExtendedAllowedCatchCategory[]
}

@ObjectType()
export class ExtendedShipStatusInformationUpdate {
  @Field(() => Ship, { nullable: true })
  shipInformation?: Ship

  @Field(() => [AllowedCatchCategory], { nullable: true })
  allowedCatchCategories?: AllowedCatchCategory[]
}
