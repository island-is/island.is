import { Field, ObjectType } from '@nestjs/graphql'
import { MileageRegistrationHistory } from './mileageRegistrationHistory.model'

@ObjectType('VehiclesMileageDetails')
export class MileageDetails {
  @Field()
  canRegisterMileage!: boolean

  @Field()
  requiresMileageRegistration!: boolean

  @Field(() => MileageRegistrationHistory, { nullable: true })
  mileageRegistrations?: MileageRegistrationHistory
}
