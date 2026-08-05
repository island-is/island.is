import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { ShipRegistrySailorCrewRegistration } from './sailorCrewRegistration.model'
import { ShipRegistrySailorCrewRegistrationLabel } from './sailorCrewRegistrationLabel.model'

@ObjectType('ShipRegistrySailorSeagoingTime')
export class ShipRegistrySailorSeagoingTimeCollection extends PaginatedResponse(
  ShipRegistrySailorCrewRegistration,
) {
  @Field(() => Int, { nullable: true })
  totalCrewRegistrationDayCount?: number

  @Field(() => Int, { nullable: true })
  seaServiceDayCount?: number

  @Field(() => Int, { nullable: true })
  workAshoreDayCount?: number

  @Field(() => Int, { nullable: true })
  totalWorkDays?: number

  @Field(() => [ShipRegistrySailorCrewRegistrationLabel])
  valueLabels!: ShipRegistrySailorCrewRegistrationLabel[]
}
