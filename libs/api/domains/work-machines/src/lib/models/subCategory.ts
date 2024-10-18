import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesSubCategory')
export class SubCategory {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  nameEn?: string | null

  @Field(() => String, { nullable: true })
  parentCategoryName?: string | null

  @Field(() => String, { nullable: true })
  parentCategoryNameEn?: string | null

  @Field(() => String, { nullable: true })
  registrationNumberPrefix?: string | null
}
