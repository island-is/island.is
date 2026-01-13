import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsInt, IsString } from 'class-validator'
import { LocaleEnum } from '../vehicles.type'

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

registerEnumType(LocaleEnum, {
  name: 'LocaleEnum',
  description: 'Available locales',
})

@InputType()
export class PostVehicleBulkMileageFileInput {
  @Field({ description: 'Example: "ISLAND.IS"' })
  originCode!: string

  @Field(() => String)
  fileUrl!: string

  @Field(() => String, { nullable: true })
  fileType?: 'csv' | 'xlsx'

  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  locale?: LocaleEnum
}
