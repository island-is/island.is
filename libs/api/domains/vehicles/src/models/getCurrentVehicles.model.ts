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
export class VehiclesCurrentVehicleWithDebtStatus extends VehiclesCurrentVehicle {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean
}

@ObjectType()
export class VehicleDebtStatusByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean
}
