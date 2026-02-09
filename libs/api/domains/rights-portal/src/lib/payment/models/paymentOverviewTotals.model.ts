import { ObjectType, Field, Int } from '@nestjs/graphql'
import { PaymentOverviewTotalsItem } from './paymentOverviewTotalsItem.model'

@ObjectType('RightsPortalPaymentOverviewTotals')
export class PaymentOverviewTotals {
  @Field(() => [PaymentOverviewTotalsItem], { nullable: true })
  items!: PaymentOverviewTotalsItem[] | null

  @Field(() => Int, { nullable: true })
  totalFullCost!: number | null

  @Field(() => Int, { nullable: true })
  totalPatientCost!: number | null

  @Field(() => Int, { nullable: true })
  totalCopayCost!: number | null
}
