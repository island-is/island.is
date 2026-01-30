import { ObjectType, Field } from '@nestjs/graphql'
import { PaymentOverviewTotalsItem } from './paymentOverviewTotalsItem.model'

@ObjectType('RightsPortalPaymentOverviewTotals')
export class PaymentOverviewTotals {
  @Field(() => [PaymentOverviewTotalsItem], { nullable: true })
  items!: PaymentOverviewTotalsItem[] | null

  @Field(() => Number, { nullable: true })
  totalFullCost!: number

  @Field(() => Number, { nullable: true })
  totalPatientCost!: number

  @Field(() => Number, { nullable: true })
  totalCopayCost!: number
}
