import { ObjectType, Field, Int } from '@nestjs/graphql'
import { InsuranceStatus } from './insuranceStatus.model'

@ObjectType('RightsPortalInsuranceOverview')
export class InsuranceOverview {
  @Field()
  isInsured!: boolean

  @Field({ nullable: true })
  explanation?: string

  @Field(() => Date)
  from!: Date

  @Field(() => InsuranceStatus)
  status!: InsuranceStatus

  @Field(() => Int)
  maximumPayment!: number

  @Field(() => Date, { nullable: true })
  ehicCardExpiryDate?: Date
}
