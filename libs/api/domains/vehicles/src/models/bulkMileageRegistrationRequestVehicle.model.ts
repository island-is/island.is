import { Field, ObjectType, ID, Int } from '@nestjs/graphql'
import { VehiclesBulkMileageReadingRequestVehicleError } from './bulkMileageReadingRequestVehicleError.model'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestVehicle {
  @Field(() => ID)
  guid!: string

  @Field()
  permNo!: string

  @Field(() => Int, { nullable: true })
  mileage?: number

  @Field({ nullable: true })
  returnCode?: string

  @Field(() => [VehiclesBulkMileageReadingRequestVehicleError], {
    nullable: true,
  })
  errors?: Array<VehiclesBulkMileageReadingRequestVehicleError>
}
