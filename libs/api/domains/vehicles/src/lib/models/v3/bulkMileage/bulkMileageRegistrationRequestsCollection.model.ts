import { Field, ObjectType } from '@nestjs/graphql'
import { VehiclesBulkMileageRegistrationRequest } from './bulkMileageRegistrationRequest.model'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestCollection {
  @Field(() => [VehiclesBulkMileageRegistrationRequest])
  requests!: Array<VehiclesBulkMileageRegistrationRequest>
}
