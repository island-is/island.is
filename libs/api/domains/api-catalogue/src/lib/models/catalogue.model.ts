import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

registerEnumType(AccessCategory, {
  name: 'accessCategoryEnum',
})

registerEnumType(PricingCategory, {
  name: 'PricingCategoryEnum',
})

registerEnumType(DataCategory, {
  name: 'DataCategoryEnum',
})

registerEnumType(TypeCategory, {
  name: 'TypeCategoryEnum',
})

@ObjectType()
export class ApiCatalogue {
  @Field(() => ID)
  id: string

  @Field()
  owner: string

  @Field()
  serviceName: string

  @Field()
  description: string

  @Field()
  url: string

  @Field(() => PricingCategory)
  pricing: PricingCategory

  @Field(() => DataCategory)
  data: DataCategory

  @Field(() => TypeCategory)
  type: TypeCategory

  @Field(() => AccessCategory)
  access: AccessCategory
}
