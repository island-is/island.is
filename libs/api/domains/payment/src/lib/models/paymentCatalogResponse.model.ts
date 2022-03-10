import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentCatalogItem } from './paymentCatalogItem.model'

@ObjectType()
export class PaymentCatalogResponse {
  @Field(() => [PaymentCatalogItem])
  items!: PaymentCatalogItem[]
}
