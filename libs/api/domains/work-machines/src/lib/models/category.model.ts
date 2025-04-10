import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesCategory')
export class Category {
  @Field()
  name!: string

  @Field({
    nullable: true,
    deprecationReason: 'Use localized name instead',
  })
  nameEn?: string

  @Field({ nullable: true })
  subCategoryName?: string

  @Field({
    nullable: true,
    deprecationReason: 'Use localized subCategoryName instead',
  })
  subCategoryNameEn?: string

  @Field({ nullable: true })
  registrationNumberPrefix?: string

  @Field(() => Category, { nullable: true })
  subCategory?: Category
}
