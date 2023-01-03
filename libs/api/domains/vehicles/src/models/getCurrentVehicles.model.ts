import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesCurrentVehicleWithDebtStatus {
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

  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean
}

@ObjectType()
export class VehicleDebtStatusByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean
}
