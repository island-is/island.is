import { ObjectType, Field } from '@nestjs/graphql'
import { Person } from './person.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'
import { PCT } from './pct.model'
import { Classification } from './classification.model'
import { Priority } from './priority.model'

@ObjectType('IntellectualPropertiesPatent')
export class Patent {
  @Field()
  name!: string

  @Field({ nullable: true })
  nameInOrgLanguage?: string

  @Field({ nullable: true })
  applicationNumber!: string

  @Field({ nullable: true })
  epApplicationNumber?: string

  @Field(() => Person, { nullable: true })
  owner?: Person

  @Field(() => Person, { nullable: true })
  agent?: Person

  @Field(() => [Person], { nullable: true })
  inventors?: Array<Person>

  @Field(() => [Priority], { nullable: true })
  priorites?: Array<Priority>

  @Field(() => [Classification], { nullable: true })
  classifications?: Array<Classification>

  @Field(() => ApplicationLifecycle)
  lifecycle?: ApplicationLifecycle

  @Field(() => PCT, { nullable: true })
  pct?: PCT

  @Field(() => Boolean, { nullable: true })
  canRenew?: boolean

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => String, { nullable: true })
  statusText?: string

  @Field(() => Date, { nullable: true })
  statusDate?: Date

  @Field(() => Date, { nullable: true })
  epPublishDate?: Date

  @Field(() => Date, { nullable: true })
  epProvisionPublishedInGazette?: Date

  @Field(() => Date, { nullable: true })
  epApplicationDate?: Date

  @Field(() => Date, { nullable: true })
  epTranslationSubmittedDate?: Date
}
