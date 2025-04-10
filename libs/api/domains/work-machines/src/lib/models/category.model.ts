import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesCategory')
export class Category {
  @Field()
  name!: string

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Use localized name instead',
  })
  nameEn?: string | null

  @Field({ nullable: true })
  subCategoryName?: string

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Use localized subCategoryName instead',
  })
  subCategoryNameEn?: string | null

  @Field({ nullable: true })
  registrationNumberPrefix?: string

  @Field(() => Category, { nullable: true })
  subCategory?: Category
}
