import { Field, ObjectType } from '@nestjs/graphql'
import { MileageDetails } from './mileageDetails.model'

@ObjectType()
export class VehicleCurrentWithMileage {
  @Field()
  vehicleId!: string

  @Field({ nullable: true })
  registrationNumber?: string

  @Field({ nullable: true })
  userRole?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  color?: string

  @Field(() => MileageDetails, { nullable: true })
  mileageDetails?: MileageDetails
}
