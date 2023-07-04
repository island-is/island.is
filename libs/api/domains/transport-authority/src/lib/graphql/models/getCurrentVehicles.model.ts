import { Field, ObjectType } from '@nestjs/graphql'

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
export class VehicleOperatorChangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

@ObjectType()
export class VehiclePlateOrderChecksByPermno {
  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

@ObjectType()
export class MyPlateOwnershipChecksByRegno {
  @Field(() => [VehicleValidationErrorMessage], { nullable: true })
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}
