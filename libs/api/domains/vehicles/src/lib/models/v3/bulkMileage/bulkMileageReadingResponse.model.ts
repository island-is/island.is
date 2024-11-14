import { Field, ObjectType, ID, Int } from '@nestjs/graphql'

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
}
