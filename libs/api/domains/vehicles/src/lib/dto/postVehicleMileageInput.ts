import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, ValidateIf } from 'class-validator'

export const mileageDeprication = {
  description:
    'Deprecated. Use {mileageNumber} instead. Keeping in for backwards compatibility',
  deprecationReason: 'Third party service wants this as an integer.',
}

@InputType()
export class PostVehicleMileageInput {
  @Field()
  permno!: string

  @Field({ description: 'Example: "ISLAND.IS"' })
  originCode!: string

  @ValidateIf((dto) => typeof dto.mileageNumber === 'undefined')
  @Field({
    nullable: true,
    ...mileageDeprication,
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
    ...mileageDeprication,
  })
  @IsOptional()
  mileage?: string

  @ValidateIf((dto) => typeof dto.mileage === 'undefined')
  @Field({ nullable: true })
  @IsOptional()
  mileageNumber?: number
}
