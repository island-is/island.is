import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EnergyFundVehicleDetailsWithGrant')
export class VehicleDetailsWithGrant {
  @Field(() => Number, { nullable: true })
  vehicleGrant?: number

  @Field(() => String, { nullable: true })
  vehicleGrantItemCode?: string

  @Field(() => Boolean, { nullable: true })
  hasReceivedSubsidy?: boolean

  @Field(() => String, { nullable: true })
  permno?: string

  @Field(() => String, { nullable: true })
  make?: string

  @Field(() => String, { nullable: true })
  color?: string

  @Field(() => Boolean, { nullable: true })
  requireMileage?: boolean

  @Field(() => Date, { nullable: true })
  newRegistrationDate?: Date

  @Field(() => Date, { nullable: true })
  firstRegistrationDate?: Date

  @Field(() => String, { nullable: true })
  vin?: string
}
