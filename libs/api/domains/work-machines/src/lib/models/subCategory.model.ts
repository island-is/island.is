import { ObjectType, Field } from '@nestjs/graphql'
import { BaseCategory } from './baseCategory.model'
import { TechInfoItem } from './techInfoItem.model'

@ObjectType('WorkMachinesSubCategory', {
  implements: () => BaseCategory,
})
export class SubCategory implements BaseCategory {
  @Field()
  name!: string

  @Field({
    nullable: true,
    deprecationReason: 'Use localized name instead',
  })
  nameEn?: string

  @Field({
    nullable: true,
    deprecationReason: 'Use parent name instead',
  })
  parentCategoryName?: string

  @Field({
    nullable: true,
    deprecationReason: 'Use localized parentCategoryName instead',
  })
  parentCategoryNameEn?: string

  @Field(() => String, { nullable: true })
  registrationNumberPrefix?: string

  @Field(() => [TechInfoItem], { nullable: true })
  techInfoItems?: Array<TechInfoItem>
}
