import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('RightsPortalPaymentOverviewInput')
export class PaymentOverviewInput {
  @Field(() => Date)
  dateFrom!: Date

  @Field(() => Date)
  dateTo!: Date

  @Field(() => String)
  serviceTypeCode!: string
}
