import { Field, ID, ObjectType } from '@nestjs/graphql'

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

@ObjectType('RightsPortalTherapies')
export class Therapies {
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
