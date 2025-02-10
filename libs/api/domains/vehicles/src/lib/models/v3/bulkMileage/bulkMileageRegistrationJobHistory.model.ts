import { Field, ObjectType } from '@nestjs/graphql'
import { VehiclesBulkMileageRegistrationJob } from './bulkMileageRegistrationJob.model'

@ObjectType()
export class VehiclesBulkMileageRegistrationJobHistory {
  @Field(() => [VehiclesBulkMileageRegistrationJob])
  history!: Array<VehiclesBulkMileageRegistrationJob>
}
