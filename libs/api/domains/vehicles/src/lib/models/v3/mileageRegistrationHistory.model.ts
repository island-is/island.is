import { Field, ObjectType } from '@nestjs/graphql'
import { MileageRegistration } from './mileageRegistration.model'

@ObjectType('VehiclesMileageRegistrationHistory')
export class MileageRegistrationHistory {
  @Field(() => MileageRegistration)
  lastMileageRegistration!: MileageRegistration

  @Field(() => [MileageRegistration])
  mileageRegistrationHistory!: Array<MileageRegistration>
}
