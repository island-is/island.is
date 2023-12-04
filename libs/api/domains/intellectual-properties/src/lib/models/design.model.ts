import { ObjectType, Field } from '@nestjs/graphql'
import { Person } from './person.model'
import { Specification } from './specification.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'

@ObjectType('IntellectualPropertiesDesign')
export class Design {
  @Field()
  hId!: string

  @Field({ nullable: true })
  applicationNumber?: string

  @Field(() => ApplicationLifecycle)
  lifecycle?: ApplicationLifecycle

  @Field({ nullable: true })
  canRenew?: boolean

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => Specification, { nullable: true })
  specification?: Specification

  @Field(() => [String], { nullable: true })
  classification?: Array<string>

  @Field(() => [Person], { nullable: true })
  owners?: Array<Person>

  @Field(() => [Person], { nullable: true })
  designers?: Array<Person>

  @Field(() => Person, { nullable: true })
  agent?: Person
}
