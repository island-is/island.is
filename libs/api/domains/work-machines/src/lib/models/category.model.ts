import { ObjectType, Field } from '@nestjs/graphql'
import { BaseCategory } from './baseCategory.model'
import { SubCategory } from './subCategory.model'

@ObjectType('WorkMachinesCategory', {
  implements: () => BaseCategory,
})
export class Category implements BaseCategory {
  @Field()
  name!: string

  @Field({
    nullable: true,
    deprecationReason: 'Use localized name instead',
  })
  nameEn?: string

  @Field({
    nullable: true,
    deprecationReason: 'Drill down into subcategories instead',
  })
  subCategoryName?: string

  @Field({
    nullable: true,
    deprecationReason:
      'Drill down into subcategories instead and use localized name',
  })
  subCategoryNameEn?: string

  @Field({
    nullable: true,
    deprecationReason:
      'Drill down into subcategories instead and use registrationNumberPrefix',
  })
  registrationNumberPrefix?: string

  @Field(() => [SubCategory], { nullable: true })
  subCategories?: Array<SubCategory>
}
