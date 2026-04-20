import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewTotalsServiceType')
export class PaymentOverviewTotalsServiceType {
  @Field()
  code!: string

  @Field({ nullable: true })
  name?: string
}
