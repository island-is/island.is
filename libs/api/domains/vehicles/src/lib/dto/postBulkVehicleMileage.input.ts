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
  permno!: string

  @Field()
  @IsInt()
  mileage!: number
}

@InputType()
export class PostVehicleBulkMileageFileInput {
  @Field({ description: 'Example: "ISLAND.IS"' })
  originCode!: string

  @Field(() => String)
  fileUrl!: string

  @Field(() => String, { nullable: true })
  fileType?: 'csv' | 'xlsx'
}
