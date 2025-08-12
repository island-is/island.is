import { Field, ObjectType } from '@nestjs/graphql'
import { MileageRegistrationHistory } from './mileageRegistrationHistory.model'
import { MileageRegistration } from './mileageRegistration.model'

@ObjectType('VehiclesMileageDetails')
export class MileageDetails {
  @Field({
    nullable: true,
  })
  canRegisterMileage?: boolean

  @Field({
    nullable: true,
  })
  requiresMileageRegistration?: boolean

  @Field(() => MileageRegistration, { nullable: true })
  lastMileageRegistration?: MileageRegistration

  @Field(() => MileageRegistrationHistory, { nullable: true })
  mileageRegistrations?: MileageRegistrationHistory
}
