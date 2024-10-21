import { Field, ObjectType } from '@nestjs/graphql'
import { MileageRegistration } from './mileageRegistration.model'

@ObjectType('VehiclesMileageRegistrationHistory')
export class MileageRegistrationHistory {
  @Field()
  vehicleId!: string

  @Field(() => MileageRegistration, { nullable: true })
  lastMileageRegistration?: MileageRegistration

  @Field(() => [MileageRegistration], { nullable: true })
  mileageRegistrationHistory?: Array<MileageRegistration>
}
