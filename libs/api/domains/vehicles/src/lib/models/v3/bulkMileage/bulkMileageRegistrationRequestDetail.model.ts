import { Field, ObjectType, ID, Int } from '@nestjs/graphql'
import { VehiclesBulkMileageRegistrationRequestError } from './bulkMileageRegistrationRequestError.model'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestDetail {
  @Field(() => ID)
  guid!: string

  @Field()
  vehicleId!: string

  @Field(() => Int, { nullable: true })
  mileage?: number

  @Field({ nullable: true })
  returnCode?: string

  @Field(() => [VehiclesBulkMileageRegistrationRequestError], {
    nullable: true,
  })
  errors?: Array<VehiclesBulkMileageRegistrationRequestError>
}
