import { ObjectType, Field } from '@nestjs/graphql'
import { PaymentOverviewServiceType } from './paymentOverviewServiceType.model'

@ObjectType('RightsPortalPaymentOverviewBill')
export class PaymentOverviewBill {
  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => PaymentOverviewServiceType, { nullable: true })
  serviceType?: PaymentOverviewServiceType | null

  @Field(() => Number, { nullable: true })
  totalAmount?: number | null

  @Field(() => Number, { nullable: true })
  insuranceAmount?: number | null

  @Field(() => Number, { nullable: true })
  documentId?: number | null
}
