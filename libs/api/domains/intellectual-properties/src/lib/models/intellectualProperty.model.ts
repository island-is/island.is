import { Person } from './person.model'
import { Specification } from './specification.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'
import { Classification } from './classification.model'
import { ObjectType, Field, Int, InterfaceType } from '@nestjs/graphql'

@InterfaceType('IntellectualProperty')
export abstract class IntellectualProperty {
  @Field()
  id!: string

  @Field({ nullable: true })
  applicationNumber?: string

  @Field(() => ApplicationLifecycle, { nullable: true })
  lifecycle?: ApplicationLifecycle

  @Field({ nullable: true })
  canRenew?: boolean

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => Specification, { nullable: true })
  specification?: Specification

  @Field(() => [Classification], { nullable: true })
  classifications?: Array<Classification>

  @Field(() => [Person], { nullable: true })
  owners?: Array<Person>

  @Field(() => [Person], { nullable: true })
  designers?: Array<Person>

  @Field(() => Person, { nullable: true })
  agent?: Person
}

@ObjectType('IntellectualPropertiesResponse')
export class IntellectualPropertiesResponse {
  @Field(() => [IntellectualProperty], { nullable: true })
  items?: Array<IntellectualProperty>

  @Field(() => Int)
  totalCount!: number
}
