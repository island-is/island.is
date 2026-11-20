import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('VehiclesMileageFeeInput')
export class GetVehicleMileageFeeInput {
  @Field()
  @IsString()
  permno!: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(2024)
  year?: number
}
