import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PostVehicleMileageInput {
  @Field()
  permno!: string

  @Field({ description: 'Example: "ISLAND.IS"' })
  originCode!: string

  @Field()
  mileage!: string
}

@InputType()
export class PutVehicleMileageInput {
  @Field()
  permno!: string

  @Field()
  internalId!: number

  @Field()
  mileage!: string
}
