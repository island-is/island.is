import { ObjectType, Field } from '@nestjs/graphql'
import { InsuranceStatus } from './insuranceStatus.model'

@ObjectType('RightsPortalInsuranceOverview')
export class InsuranceOverview {
  @Field(() => Boolean, { nullable: true })
  isInsured?: boolean | null

  @Field(() => String, { nullable: true })
  explanation?: string | null

  @Field(() => Date, { nullable: true })
  updated?: Date | null

  @Field(() => Date, { nullable: true })
  from?: Date | null

  @Field(() => InsuranceStatus, { nullable: true })
  status?: InsuranceStatus

  @Field(() => Number, { nullable: true })
  maximumPayment?: number | null
}
