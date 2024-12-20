import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetVehicleMileageInput {
  @Field()
  permno!: string
}
