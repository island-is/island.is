import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleValidationErrorMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class BasicVehicleInformation {
  @Field(() => String, { nullable: true })
  permno?: string | null

  @Field(() => String, { nullable: true })
  make?: string | null

  @Field(() => String, { nullable: true })
  color?: string | null

  @Field(() => String, { nullable: true })
  role?: string | null

  @Field(() => Int, { nullable: true })
  numberOfAxles?: number | null

  @Field(() => Boolean, { nullable: true })
  requireMileage?: boolean | null

  @Field(() => String, { nullable: true })
  mileageReading?: string | null

  @Field(() => Boolean, { nullable: true })
  vehicleHasMilesOdometer?: boolean | null
}

@ObjectType()
export class VehicleOwnerchangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null

  @Field(() => BasicVehicleInformation, { nullable: true })
  basicVehicleInformation?: BasicVehicleInformation | null
}

@ObjectType()
export class VehicleOperatorChangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null

  @Field(() => BasicVehicleInformation, { nullable: true })
  basicVehicleInformation?: BasicVehicleInformation | null
}

@ObjectType()
export class VehiclePlateOrderChecksByPermno {
  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null

  @Field(() => BasicVehicleInformation, { nullable: true })
  basicVehicleInformation?: BasicVehicleInformation | null
}

@ObjectType()
export class MyPlateOwnershipChecksByRegno {
  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}
