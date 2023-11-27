import { Field, InputType } from '@nestjs/graphql'

@InputType('CreateVehicleInput')
export class CreateVehicleInput {
  @Field()
  permno!: string
}
