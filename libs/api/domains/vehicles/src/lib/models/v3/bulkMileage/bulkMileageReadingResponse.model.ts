import { Field, ObjectType, ID, Int } from '@nestjs/graphql'
import { VehiclesBulkMileageOrigin } from './bulkMileageOrigin.model'

@ObjectType()
export class VehiclesBulkMileageReadingResponse {
  @Field(() => ID, {
    nullable: true,
    description:
      'The GUID of the mileage registration post request. Used to fetch job status',
  })
  requestId?: string

  @Field(() => Int, { nullable: true })
  errorCode?: number

  @Field({ nullable: true })
  errorMessage?: string

  @Field(() => VehiclesBulkMileageOrigin, { nullable: true })
  origin?: VehiclesBulkMileageOrigin
}
