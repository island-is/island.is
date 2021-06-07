import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentCatalog } from './paymentCatalog.model'

@ObjectType()
export class PaymentCatalogResponse {
  @Field(() => [PaymentCatalog])
  item!: PaymentCatalog[]
}
