import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('RightsPortalTherapiesState')
class State {
  @Field(() => String)
  display!: string

  @Field(() => String)
  code!: string
}

@ObjectType('RightsPortalTherapiesSessions')
class Sessions {
  @Field(() => Number)
  available!: number

  @Field(() => Number)
  used!: number
}

@ObjectType('RightsPortalTherapiesPeriods')
class Periods {
  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Sessions, { nullable: true })
  sessions?: Sessions

  @Field(() => Date, { nullable: true })
  to?: Date
}

@ObjectType('RightsPortalTherapy')
export class Therapy {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field({ nullable: true })
  postStation?: string

  @Field(() => [Periods], { nullable: true })
  periods?: Periods[]

  @Field(() => State, { nullable: true })
  state?: State
}

@ObjectType('RightsPortalPaginatedTherapies')
export class PaginatedTherapiesResponse extends PaginatedResponse(Therapy) {}
