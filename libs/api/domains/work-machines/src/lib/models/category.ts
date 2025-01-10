import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesCategory')
export class Category {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  nameEn?: string | null

  @Field(() => String, { nullable: true })
  subCategoryName?: string | null

  @Field(() => String, { nullable: true })
  subCategoryNameEn?: string | null

  @Field(() => String, { nullable: true })
  registrationNumberPrefix?: string | null
}
