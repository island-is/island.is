import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql'
import { ApplicationLifecycle } from './applicationLifecycle.model'
import { Person } from './person.model'
import { Patent } from './patent.model'
import { AnnualFeesInfo } from './annualFeeInfo.model'
import { MarketingAuthorization } from './marketingAuthorization.model'

@ObjectType('IntellectualPropertiesSPC', {
  implements: () => [Patent],
})
export class SPC implements Patent {
  @Field()
  name!: string

  @Field({ description: 'Parent patent number' })
  applicationNumber!: string

  @Field()
  id!: string

  @Field()
  number!: string

  @Field({ nullable: true })
  medicine?: string

  @Field({ nullable: true })
  medicineForChildren?: boolean

  @Field({ nullable: true })
  message?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  maxDuration?: Date

  @Field({ nullable: true })
  status?: string

  @Field(() => AnnualFeesInfo, { nullable: true })
  annualFeesInfo?: AnnualFeesInfo

  @Field(() => MarketingAuthorization, { nullable: true })
  marketingAuthorization?: MarketingAuthorization

  @Field(() => Person, { nullable: true })
  agent?: Person

  @Field(() => GraphQLISODateTime, { nullable: true })
  grantPublishedInGazetteDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  publishedInGazetteDate?: Date

  @Field(() => ApplicationLifecycle, { nullable: true })
  applicationLifecycle?: ApplicationLifecycle
}
