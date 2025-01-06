import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateWaitlist')
export class Waitlist {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  waitBeganDate?: string

  @Field({ nullable: true })
  lastUpdated?: string

  @Field({ nullable: true })
  organizationName?: string

  @Field({ nullable: true })
  statusDisplay?: string
}

@ObjectType('HealthDirectorateWaitlists')
export class Waitlists {
  @Field(() => [Waitlist])
  waitlists!: Waitlist[]
}
