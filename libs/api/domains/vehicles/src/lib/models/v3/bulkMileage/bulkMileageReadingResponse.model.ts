import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class VehiclesBulkMileageReadingResponse {
  @Field(() => ID, {
    description:
      'The GUID of the mileage registration post request. Used to fetch job status',
  })
  requestId!: string

  @Field({ nullable: true })
  errorMessage?: string
}
