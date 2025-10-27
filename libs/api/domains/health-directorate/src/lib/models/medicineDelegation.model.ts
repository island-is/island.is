import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateMedicineDelegationDates')
export class MedicineDelegationDates {
  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date
}

@ObjectType('HealthDirectorateMedicineDelegationItem')
export class MedicineDelegationItem {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean

  @Field(() => Boolean, { nullable: true })
  lookup?: boolean

  @Field(() => MedicineDelegationDates, { nullable: true })
  dates?: MedicineDelegationDates
}

@ObjectType('HealthDirectorateMedicineDelegations')
export class MedicineDelegations {
  @Field(() => [MedicineDelegationItem], { nullable: true })
  items?: MedicineDelegationItem[]
}
