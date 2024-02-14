import { Field, InterfaceType } from '@nestjs/graphql'
import { Person } from './person.model'
import { ApplicationLifecycle } from './applicationLifecycle.model'
import { Classification } from './classification.model'
import { Priority } from './priority.model'
import { IntellectualProperty } from './intellectualProperty.model'
import { AnnualFeesInfo } from './annualFeeInfo.model'
import { PatentEP } from './patentEP.model'
import { SPC } from './spc.model'
import { PatentIS } from './patentIS.model'

@InterfaceType('IntellectualPropertiesPatent', {
  implements: () => IntellectualProperty,
  resolveType(patent) {
    if (patent.epApplicationNumber) {
      return PatentEP
    }
    if (patent.medicine) {
      return SPC
    }
    return PatentIS
  },
})
export abstract class Patent implements IntellectualProperty {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  applicationNumber?: string

  @Field({ nullable: true })
  nameInOrgLanguage?: string

  @Field(() => [Person], { nullable: true })
  owners?: Array<Person>

  @Field(() => Person, { nullable: true })
  agent?: Person

  @Field(() => AnnualFeesInfo, { nullable: true })
  annualFeesInfo?: AnnualFeesInfo

  @Field(() => [Person], { nullable: true })
  inventors?: Array<Person>

  @Field(() => [Priority], { nullable: true })
  priorities?: Array<Priority>

  @Field(() => [Classification], { nullable: true })
  classifications?: Array<Classification>

  @Field(() => ApplicationLifecycle, { nullable: true })
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
