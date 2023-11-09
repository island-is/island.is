import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('RightsPortalPaymentOverviewInput')
export class PaymentOverviewInput {
  @Field(() => String)
  dateFrom!: string

  @Field(() => String)
  dateTo!: string

  @Field(() => String)
  serviceTypeCode!: string
}
