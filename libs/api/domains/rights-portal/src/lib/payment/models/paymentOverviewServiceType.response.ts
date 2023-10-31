import { ObjectType, Field } from "@nestjs/graphql"
import { PaymentError } from "./paymentError.model"
import { PaymentOverviewServiceType } from "./paymentOverviewServiceType.model"

@ObjectType('RightsPortalPaymentOverviewServiceTypeResponse')
export class PaymentOverviewServiceTypeResponse {
  @Field(() => [PaymentOverviewServiceType])
  items!: PaymentOverviewServiceType[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
