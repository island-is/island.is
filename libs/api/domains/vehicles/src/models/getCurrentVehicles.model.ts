import { Field, ObjectType } from '@nestjs/graphql'
import { VehiclesUpdatelocks } from './getVehicleDetail.model'

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

  @Field(() => [VehiclesUpdatelocks], { nullable: true })
  updatelocks?: VehiclesUpdatelocks[]

  @Field(() => [OwnerChangeVehicleValidationMessage], { nullable: true })
  ownerChangeErrorMessages?: OwnerChangeVehicleValidationMessage[] | null
}

@ObjectType()
export class OwnerChangeVehicleValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: number | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class VehicleOwnerchangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [VehiclesUpdatelocks], { nullable: true })
  updatelocks?: VehiclesUpdatelocks[]

  @Field(() => [OwnerChangeVehicleValidationMessage], { nullable: true })
  ownerChangeErrorMessages?: OwnerChangeVehicleValidationMessage[] | null
}
