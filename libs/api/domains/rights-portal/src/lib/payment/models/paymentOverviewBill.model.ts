import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewBill')
export class PaymentOverviewBill {
  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => String, { nullable: true })
  serviceType?: string | null

  @Field(() => Number, { nullable: true })
  totalAmount?: number | null

  @Field(() => Number, { nullable: true })
  insuranceAmount?: number | null

  @Field(() => Number, { nullable: true })
  documentId?: number | null
}
