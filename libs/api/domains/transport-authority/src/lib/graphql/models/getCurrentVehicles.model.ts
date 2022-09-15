import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesCurrentVehicleWithOwnerchangeChecks {
  @Field({ nullable: true })
  permno?: string

  @Field({ nullable: true })
  make?: string

  @Field({ nullable: true })
  color?: string

  @Field({ nullable: true })
  role?: string

  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

@ObjectType()
export class VehicleValidationErrorMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class VehicleOwnerchangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

@ObjectType()
export class VehiclesCurrentVehicleWithOperatorChangeChecks extends VehiclesCurrentVehicleWithOwnerchangeChecks {}

@ObjectType()
export class VehicleOperatorChangeChecksByPermno extends VehicleOwnerchangeChecksByPermno {}

@ObjectType()
export class VehiclesCurrentVehicleWithPlateOrderChecks {
  @Field({ nullable: true })
  permno?: string

  @Field({ nullable: true })
  make?: string

  @Field({ nullable: true })
  color?: string

  @Field({ nullable: true })
  role?: string

  @Field(() => Boolean, { nullable: true })
  duplicateOrderExists?: boolean
}

@ObjectType()
export class VehiclePlateOrderChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  duplicateOrderExists?: boolean
}
