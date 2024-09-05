import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesBulkMileageReadingRequestVehicleError {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  message?: string
}
