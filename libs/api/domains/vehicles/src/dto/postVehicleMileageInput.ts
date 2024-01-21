import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, ValidateIf } from 'class-validator'

@InputType()
export class PostVehicleMileageInput {
  @Field()
  permno!: string

  @Field({ description: 'Example: "ISLAND.IS"' })
  originCode!: string

  @ValidateIf((dto) => typeof dto.mileageNumber === 'undefined')
  @Field({
    nullable: true,
    description: 'Deprecated. Use "mileageNumber" instead',
  })
  @IsOptional()
  mileage?: string

  @ValidateIf((dto) => typeof dto.mileage === 'undefined')
  @Field({ nullable: true })
  @IsOptional()
  mileageNumber?: number
}

@InputType()
export class PutVehicleMileageInput {
  @Field()
  permno!: string

  @Field()
  internalId!: number

  @ValidateIf((dto) => typeof dto.mileageNumber === 'undefined')
  @Field({
    nullable: true,
    description: 'Deprecated. Use "mileageNumber" instead',
  })
  @IsOptional()
  mileage?: string

  @ValidateIf((dto) => typeof dto.mileage === 'undefined')
  @Field({ nullable: true })
  @IsOptional()
  mileageNumber?: number
}
