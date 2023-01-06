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

  @Field(() => [OwnerChangeVehicleValidationMessage], { nullable: true })
  ownerChangeErrorMessages?: OwnerChangeVehicleValidationMessage[] | null
}

@ObjectType()
export class OwnerChangeVehicleValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class VehicleOwnerchangeChecksByPermno {
  @Field(() => Boolean, { nullable: true })
  isDebtLess?: boolean

  @Field(() => [OwnerChangeVehicleValidationMessage], { nullable: true })
  ownerChangeErrorMessages?: OwnerChangeVehicleValidationMessage[] | null
}
