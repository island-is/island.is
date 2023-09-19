import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType('ShipRegistryShipOwner')
class ShipOwner {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => Number, { nullable: true })
  sharePercentage?: number
}

@ObjectType('ShipRegistryShip')
class Ship {
  @Field(() => String, { nullable: true })
  shipName?: string

  @Field(() => String, { nullable: true })
  shipType?: string

  @Field(() => Number, { nullable: true })
  regno?: number

  @Field(() => String, { nullable: true })
  region?: string

  @Field(() => String, { nullable: true })
  portOfRegistry?: string

  @Field(() => String, { nullable: true })
  regStatus?: string

  @Field(() => Number, { nullable: true })
  grossTonnage?: number

  @Field(() => Number, { nullable: true })
  length?: number

  @Field(() => String, { nullable: true })
  manufactionYear?: number

  @Field(() => String, { nullable: true })
  manufacturer?: string

  @CacheField(() => [ShipOwner], { nullable: true })
  owners?: ShipOwner[]
}

@ObjectType('ShipRegistryShipSearch')
export class ShipSearch {
  @CacheField(() => [Ship])
  ships!: Ship[]
}
