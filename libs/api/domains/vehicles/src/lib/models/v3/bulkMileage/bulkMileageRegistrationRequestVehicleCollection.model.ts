import { Field, ObjectType } from '@nestjs/graphql'
import { VehiclesBulkMileageRegistrationRequestVehicle } from './bulkMileageRegistrationRequestVehicle.model'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestVehicleCollection {
  @Field(() => [VehiclesBulkMileageRegistrationRequestVehicle], {
    nullable: true,
  })
  vehicles?: Array<VehiclesBulkMileageRegistrationRequestVehicle>
}
