import { Field, ObjectType } from '@nestjs/graphql'
import { MileageDetails } from './mileageDetails.model'
import { Color } from './color.model'
import { Registration } from './registration.model'

@ObjectType()
export class VehicleCurrentWithMileage {
  @Field()
  vehicleId!: string

  @Field(() => Registration, { nullable: true })
  registration?: Registration

  @Field({ nullable: true })
  userRole?: string

  @Field({ nullable: true })
  make?: string

  @Field(() => Color, { nullable: true })
  color?: Color

  @Field({ nullable: true, description: 'ISO8601' })
  nextInspection?: string

  @Field(() => MileageDetails, { nullable: true })
  mileageDetails?: MileageDetails

  @Field({ nullable: true })
  co2?: string
}
