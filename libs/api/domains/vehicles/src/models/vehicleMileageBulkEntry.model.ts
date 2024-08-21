import { ObjectType, Field } from '@nestjs/graphql'
import { VehicleMileageRegistration } from './vehicleMileageRegistration.model'

@ObjectType('VehicleMileageBulkEntry')
export class VehicleMileageBulkEntry {
  @Field()
  title!: string

  @Field()
  permNo!: string

  @Field({
    nullable: true,
    description: 'Can this vehicle have a new mileage registered?',
  })
  canRegisterMileage?: boolean

  @Field({
    nullable: true,
    description:
      'Indicates that the user has already posted a reading today. So instead of posting a new reading, should be editing the reading from today',
  })
  isCurrentlyEditing?: boolean

  @Field({
    nullable: true,
    description:
      'Does the current user have authorization to register vehicle mileage?',
  })
  canUserRegisterVehicleMileage?: boolean

  @Field(() => VehicleMileageRegistration, { nullable: true })
  latestRegistration?: VehicleMileageRegistration

  @Field(() => [VehicleMileageRegistration], { nullable: true })
  mileageRegistrationHistory?: Array<VehicleMileageRegistration>
}
