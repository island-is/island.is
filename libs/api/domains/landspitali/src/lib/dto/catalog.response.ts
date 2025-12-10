import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType, Int } from '@nestjs/graphql'

@ObjectType('WebLandspitaliCatalog')
export class Catalog {
  @CacheField(() => [CatalogItem])
  item!: CatalogItem[]
}

@ObjectType('WebLandspitaliCatalogItem')
export class CatalogItem {
  @Field(() => String)
  performingOrgID!: string

  @Field(() => String)
  chargeType!: string

  @Field(() => String)
  chargeItemCode!: string

  @Field(() => String)
  chargeItemName!: string

  @Field(() => Int)
  priceAmount!: number
}
