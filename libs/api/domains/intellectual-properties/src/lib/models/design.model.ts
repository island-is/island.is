import { ObjectType, Field } from '@nestjs/graphql'
import { Person } from './person.model'
import { Specification } from './specification.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'
import { Classification } from './classification.model'
import { IntellectualProperty } from './intellectualProperty.model'

@ObjectType('IntellectualPropertiesDesign', {
  implements: () => IntellectualProperty,
})
export class Design implements IntellectualProperty {
  @Field()
  id!: string

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

  @Field(() => [Classification], { nullable: true })
  classification?: Array<Classification>

  @Field(() => [Person], { nullable: true })
  owners?: Array<Person>

  @Field(() => [Person], { nullable: true })
  designers?: Array<Person>

  @Field(() => Person, { nullable: true })
  agent?: Person
}
