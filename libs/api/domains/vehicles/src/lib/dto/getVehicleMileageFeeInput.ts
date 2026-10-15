import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType('VehiclesMileageFeeInput')
export class GetVehicleMileageFeeInput {
  @Field()
  @IsString()
  permno!: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  year?: number
}
