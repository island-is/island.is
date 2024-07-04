import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetVehicleInput {
  @Field()
  @IsString()
  vehicleId!: string
}
