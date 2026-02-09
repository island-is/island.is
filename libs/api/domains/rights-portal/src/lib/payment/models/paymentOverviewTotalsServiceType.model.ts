import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewTotalsServiceType')
export class PaymentOverviewTotalsServiceType {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  name?: string
}
