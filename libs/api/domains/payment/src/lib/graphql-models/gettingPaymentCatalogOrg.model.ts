import { Field, ObjectType } from '@nestjs/graphql'
import { Catalog } from '@island.is/clients/payment'


@ObjectType()
export class GettingPaymentCatalogOrg {
  @Field()
  items!: Catalog
}