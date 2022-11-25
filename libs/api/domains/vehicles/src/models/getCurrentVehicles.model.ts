import { Field, ObjectType } from '@nestjs/graphql'

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
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean
}

@ObjectType()
export class VehicleFeesByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean
}

@ObjectType()
export class VehicleFeesByPermno2 {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean
}
