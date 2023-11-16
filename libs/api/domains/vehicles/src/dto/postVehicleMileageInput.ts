import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PostVehicleMileageInput {
  @Field()
  permno!: string

  @Field()
  originCode!: string

  @Field()
  mileage!: string
}
