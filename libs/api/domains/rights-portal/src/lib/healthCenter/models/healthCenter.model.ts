import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Address } from './address.model'

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
