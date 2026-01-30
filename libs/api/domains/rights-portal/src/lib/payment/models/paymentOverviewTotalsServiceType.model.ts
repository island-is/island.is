import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewTotalsServiceType')
export class PaymentOverviewTotalsServiceType {
  @Field(() => String, { nullable: true })
  code?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
