import { Field, ObjectType } from '@nestjs/graphql'
import { MileageRegistrationHistory } from './mileageRegistrationHistory.model'

@ObjectType('VehiclesMileageDetails')
export class MileageDetails {
  @Field({ nullable: true })
  canRegisterMileage?: boolean

  @Field({ nullable: true })
  requiresMileageRegistration?: boolean

  @Field(() => MileageRegistrationHistory, { nullable: true })
  mileageRegistrations?: MileageRegistrationHistory
}
