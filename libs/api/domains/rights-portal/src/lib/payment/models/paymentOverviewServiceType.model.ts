import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewServiceType')
export class PaymentOverviewServiceType {
  @Field(() => String, { nullable: true })
  code?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
