import { Field, ObjectType } from '@nestjs/graphql'
import { VehiclesBulkMileageRegistrationRequestDetail } from './bulkMileageRegistrationRequestDetail.model'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestOverview {
  @Field(() => [VehiclesBulkMileageRegistrationRequestDetail])
  requests!: Array<VehiclesBulkMileageRegistrationRequestDetail>
}
