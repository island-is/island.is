import { Field, InputType } from '@nestjs/graphql'
import { IsInt, IsString } from 'class-validator'

@InputType()
export class PostVehicleBulkMileageInput {
  @Field({ description: 'Example: "ISLAND.IS"' })
  originCode!: string

  @Field(() => [PostVehicleBulkMileageSingleInput])
  mileageData!: Array<PostVehicleBulkMileageSingleInput>
}

@InputType()
export class PostVehicleBulkMileageSingleInput {
  @Field()
  @IsString()
  vehicleId!: string

  @Field()
  @IsInt()
  mileageNumber!: number
}
