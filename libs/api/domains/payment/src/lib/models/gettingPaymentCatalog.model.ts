import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentCatalogItem } from '../models/paymentCatalogItem.model'

@ObjectType()
export class GettingPaymentCatalog {
  @Field(() => [PaymentCatalogItem])
  items!: PaymentCatalogItem[]
}
