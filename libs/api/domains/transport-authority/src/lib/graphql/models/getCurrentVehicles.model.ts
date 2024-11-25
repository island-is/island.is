import { Field, ObjectType } from '@nestjs/graphql'
import { TransportAuthorityValidationMessage } from './validation.model'

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

  @Field(() => Boolean, { nullable: true })
  requireMileage?: boolean | null

  @Field(() => String, { nullable: true })
  mileageReading?: string | null
}

@ObjectType()
export class VehicleOwnerchangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [TransportAuthorityValidationMessage], { nullable: true })
  validationErrorMessages?: TransportAuthorityValidationMessage[] | null

  @Field(() => BasicVehicleInformation, { nullable: true })
  basicVehicleInformation?: BasicVehicleInformation | null
}

@ObjectType()
export class VehicleOperatorChangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [TransportAuthorityValidationMessage], { nullable: true })
  validationErrorMessages?: TransportAuthorityValidationMessage[] | null

  @Field(() => BasicVehicleInformation, { nullable: true })
  basicVehicleInformation?: BasicVehicleInformation | null
}

@ObjectType()
export class VehiclePlateOrderChecksByPermno {
  @Field(() => [TransportAuthorityValidationMessage], { nullable: true })
  validationErrorMessages?: TransportAuthorityValidationMessage[] | null

  @Field(() => BasicVehicleInformation, { nullable: true })
  basicVehicleInformation?: BasicVehicleInformation | null
}

@ObjectType()
export class MyPlateOwnershipChecksByRegno {
  @Field(() => [TransportAuthorityValidationMessage], { nullable: true })
  validationErrorMessages?: TransportAuthorityValidationMessage[] | null
}
