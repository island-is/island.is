import { ObjectType, Field, Int } from '@nestjs/graphql'
import { InsuranceStatus } from './insuranceStatus.model'

@ObjectType('RightsPortalInsuranceOverview')
export class InsuranceOverview {
  @Field()
  isInsured!: boolean

  @Field({ nullable: true })
  explanation?: string

  @Field(() => Date, { nullable: true })
  from?: Date | null

  @Field(() => InsuranceStatus)
  status!: InsuranceStatus

  @Field(() => Int, { nullable: true })
  maximumPayment?: number | null

  @Field(() => Date, { nullable: true })
  ehicCardExpiryDate?: Date
}
