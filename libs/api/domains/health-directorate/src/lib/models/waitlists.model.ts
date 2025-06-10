import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateWaitlist')
export class Waitlist {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  waitBegan?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date

  @Field()
  organization!: string

  @Field()
  status!: string
}

@ObjectType('HealthDirectorateWaitlists')
export class Waitlists {
  @Field(() => [Waitlist])
  waitlists!: Waitlist[]
}
