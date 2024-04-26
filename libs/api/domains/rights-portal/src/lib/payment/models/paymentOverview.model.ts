import { ObjectType, Field } from '@nestjs/graphql'
import { PaymentOverviewBill } from './paymentOverviewBill.model'

@ObjectType('RightsPortalPaymentOverview')
export class PaymentOverview {
  @Field(() => Number, { nullable: true })
  credit?: number | null

  @Field(() => Number, { nullable: true })
  debt?: number | null

  @Field(() => [PaymentOverviewBill], { nullable: true })
  bills?: PaymentOverviewBill[] | null
}
