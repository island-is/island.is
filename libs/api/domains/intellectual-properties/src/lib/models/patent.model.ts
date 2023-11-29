import { ObjectType, Field } from '@nestjs/graphql'
import { Person } from './person.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'
import { Category } from './category.model'

@ObjectType('IntellectualPropertyPatent')
export class Patent {
  @Field()
  applicationNumber!: string

  @Field()
  name!: string

  @Field(() => Category, { nullable: true })
  category?: Category

  @Field(() => Person, { nullable: true })
  owner?: Person

  @Field(() => Person, { nullable: true })
  agent?: Person

  @Field(() => Person, { nullable: true })
  inventors?: Person

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
