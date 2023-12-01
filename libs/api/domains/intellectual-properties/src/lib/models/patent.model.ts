import { ObjectType, Field } from '@nestjs/graphql'
import { Person } from './person.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'

@ObjectType('IntellectualPropertiesPatent')
export class Patent {
  @Field()
  name!: string

  @Field({ nullable: true })
  applicationNumber!: string

  @Field(() => Person, { nullable: true })
  owner?: Person

  @Field(() => Person, { nullable: true })
  agent?: Person

  @Field(() => [Person], { nullable: true })
  inventors?: Array<Person>

  @Field(() => ApplicationLifecycle)
  lifecycle?: ApplicationLifecycle

  @Field(() => Boolean, { nullable: true })
  canRenew?: boolean

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => String, { nullable: true })
  statusText?: string

  @Field(() => Date, { nullable: true })
  statusDate?: Date
}
