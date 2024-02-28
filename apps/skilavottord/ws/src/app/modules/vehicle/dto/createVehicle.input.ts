import { Field, InputType } from '@nestjs/graphql'

@InputType('CreateVehicleInput')
export class CreateVehicleInput {
  @Field()
  permno!: string

  @Field()
  mileage!: number

  @Field()
  vin!: string

  @Field()
  make!: string

  @Field()
  firstRegistrationDate!: Date

  @Field()
  color!: string
}
