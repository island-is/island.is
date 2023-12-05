import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleDetailsByVin {
  @Field(() => Number, { nullable: true })
  vehicleGrant?: number

  @Field(() => String, { nullable: true })
  vehicleGrantItemCode?: string

  @Field(() => Boolean, { nullable: true })
  hasReceivedSubsidy?: boolean
}
