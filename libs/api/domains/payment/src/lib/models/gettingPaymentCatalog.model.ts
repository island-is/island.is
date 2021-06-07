import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentCatalog } from '../models/paymentCatalog.model'

@ObjectType()
export class GettingPaymentCatalog {
  @Field(() => [PaymentCatalog])
  item!: PaymentCatalog[]
}
