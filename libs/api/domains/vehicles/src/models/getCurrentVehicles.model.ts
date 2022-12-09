import { Field, ObjectType } from '@nestjs/graphql'
import { VehiclesUpdatelocks } from './getVehicleDetail.model'

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
}

@ObjectType()
export class OwnerChangeValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: number | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class VehiclesCurrentVehicleWithOwnerchangeChecks extends VehiclesCurrentVehicle {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehiclesUpdatelocks], { nullable: true })
  updatelocks?: VehiclesUpdatelocks[]

  @Field(() => [OwnerChangeValidationMessage], { nullable: true })
  ownerChangeErrorMessages?: OwnerChangeValidationMessage[] | null
}

@ObjectType()
export class VehicleOwnerchangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehiclesUpdatelocks], { nullable: true })
  updatelocks?: VehiclesUpdatelocks[]

  @Field(() => [OwnerChangeValidationMessage], { nullable: true })
  ownerChangeErrorMessages?: OwnerChangeValidationMessage[] | null
}
