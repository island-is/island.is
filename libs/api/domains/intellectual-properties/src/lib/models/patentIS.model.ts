import { ObjectType, Field } from '@nestjs/graphql'
import { Person } from './person.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'
import { PCT } from './pct.model'
import { Classification } from './classification.model'
import { Priority } from './priority.model'
import { Patent } from './patent.model'
import { AnnualFeesInfo } from './annualFeeInfo.model'
import { IntellectualProperty } from './intellectualProperty.model'

@ObjectType('IntellectualPropertiesPatentIS', {
  implements: () => [Patent, IntellectualProperty],
})
export class PatentIS implements Patent, IntellectualProperty {
  @Field()
  id!: string

  @Field({ nullable: true })
  applicationNumber?: string

  @Field({ nullable: true })
  registrationNumber?: string

  @Field()
  name!: string

  @Field({ nullable: true })
  nameInOrgLanguage?: string

  @Field({ nullable: true })
  status?: string

  @Field({ nullable: true })
  statusText?: string

  @Field(() => Date, { nullable: true })
  statusDate?: Date

  @Field({ nullable: true })
  canRenew?: boolean

  @Field({ nullable: true, description: 'Possible IP application error state' })
  error?: string

  @Field(() => Boolean, { nullable: true })
  alive?: boolean

  @Field(() => [Person], { nullable: true })
  owners?: Array<Person>

  @Field(() => Person, { nullable: true })
  agent?: Person

  @Field(() => [Person], { nullable: true })
  inventors?: Array<Person>

  @Field(() => [Priority], { nullable: true })
  priorities?: Array<Priority>

  @Field(() => [Classification], { nullable: true })
  classifications?: Array<Classification>

  @Field(() => ApplicationLifecycle, { nullable: true })
  lifecycle?: ApplicationLifecycle

  @Field(() => AnnualFeesInfo, { nullable: true })
  annualFeesInfo?: AnnualFeesInfo

  @Field(() => PCT, { nullable: true })
  pct?: PCT

  @Field(() => [String], { nullable: true })
  spcNumbers?: Array<string>
}
