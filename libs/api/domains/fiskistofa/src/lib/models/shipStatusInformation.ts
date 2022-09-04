import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Ship {
  @Field()
  id!: string

  @Field()
  shipNumber?: number

  @Field()
  name!: string

  @Field()
  timePeriod!: string
}

@ObjectType()
class AllowedCatchCategory {
  @Field()
  id?: number
  @Field()
  name!: string
  @Field()
  allocation?: number
  @Field()
  specialAlloction?: number
  @Field()
  betweenYears?: number
  @Field()
  betweenShips?: number
  @Field()
  allowedCatch?: number
  @Field()
  catch?: number
  @Field()
  status?: number
  @Field()
  displacement?: number
  @Field()
  newStatus?: number
  @Field()
  nextYear?: number
  @Field()
  excessCatch?: number
  @Field()
  unused?: number
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
