import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { ShipRegistrySailorSeaServiceBookEntry } from './sailorSeaServiceBookEntry.model'

@ObjectType('ShipRegistrySailorSeaServiceBook')
export class ShipRegistrySailorSeaServiceBookCollection extends PaginatedResponse(
  ShipRegistrySailorSeaServiceBookEntry,
) {
  @Field(() => Int, { nullable: true })
  totalCrewRegistrationDayCount?: number

  @Field(() => Int, { nullable: true })
  seaServiceDayCount?: number

  @Field(() => Int, { nullable: true })
  workAshoreDayCount?: number

  @Field(() => Int, { nullable: true })
  totalWorkDays?: number
}
