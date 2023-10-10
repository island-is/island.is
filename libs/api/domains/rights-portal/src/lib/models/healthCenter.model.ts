import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Address } from './address.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('RightsPortalHealthCenterRegistration')
export class HealthCenterRegistration {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date | null

  @Field(() => Date, { nullable: true })
  dateTo?: Date | null

  @Field(() => String, { nullable: true })
  healthCenterName?: string | null

  @Field(() => String, { nullable: true })
  doctor?: string | null
}

@ObjectType('RightsPortalUserHealthCenterRegistration')
export class UserHealthCenterRegistration {
  @Field(() => HealthCenterRegistration, { nullable: true })
  current?: HealthCenterRegistration

  @Field(() => [HealthCenterRegistration], { nullable: true })
  history?: Array<HealthCenterRegistration>

  @Field(() => Boolean, { nullable: true })
  canRegister?: boolean | null
}

@ObjectType('RightsPortalHealthCenter')
export class HealthCenter {
  @Field(() => ID)
  id!: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  region?: string | null

  @Field(() => Address, { nullable: true })
  address?: Address

  @Field(() => Boolean, { nullable: true })
  waitListRegistration?: boolean | null
}

@ObjectType('RightsPortalPaginatedHealthCenters')
export class PaginatedHealthCentersResponse extends PaginatedResponse(
  HealthCenter,
) {}
