import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsurancePaymentTypeOverview')
export class PaymentTypeOverview {
  @Field(() => String, { nullable: true })
  paymentType?: string

  @Field(() => Date, { nullable: true })
  dateFrom?: Date

  @Field(() => Date, { nullable: true })
  dateTo?: Date
}
