import { ObjectType, Field, Int } from '@nestjs/graphql'
import { PaymentOverviewTotalsItem } from './paymentOverviewTotalsItem.model'

@ObjectType('RightsPortalPaymentOverviewTotals')
export class PaymentOverviewTotals {
  @Field(() => [PaymentOverviewTotalsItem], { nullable: true })
  items?: PaymentOverviewTotalsItem[]

  @Field(() => Int, { nullable: true })
  totalFullCost?: number

  @Field(() => Int, { nullable: true })
  totalPatientCost?: number

  @Field(() => Int, { nullable: true })
  totalCopayCost?: number
}
