import { Field, ObjectType } from '@nestjs/graphql'
import { VehiclesFees } from './getVehicleDetail.model'

@ObjectType()
export class VehiclesCurrentVehicle {
  @Field({ nullable: true })
  permno?: string

  @Field({ nullable: true })
  make?: string

  @Field({ nullable: true })
  color?: string

  @Field({ nullable: true })
  role?: string

  @Field(() => Boolean, { nullable: true })
  isStolen?: boolean
}

@ObjectType()
export class VehiclesCurrentVehicleWithFees extends VehiclesCurrentVehicle {
  @Field(() => VehiclesFees, { nullable: true })
  fees?: VehiclesFees
}

@ObjectType()
export class VehicleFeesByPermno {
  @Field(() => VehiclesFees, { nullable: true })
  fees?: VehiclesFees
}
