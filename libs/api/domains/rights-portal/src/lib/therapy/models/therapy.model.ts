import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { TherapyPeriod } from './therapyPeriod.model'
import { TherapyState } from './therapyState.model'

@ObjectType('RightsPortalTherapy')
export class Therapy {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field({ nullable: true })
  postStation?: string

  @Field(() => [TherapyPeriod], { nullable: true })
  periods?: TherapyPeriod[]

  @Field(() => TherapyState, { nullable: true })
  state?: TherapyState
}

@ObjectType('RightsPortalPaginatedTherapies')
export class PaginatedTherapyResponse extends PaginatedResponse(Therapy) {}
