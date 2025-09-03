import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentProviderCategoryStatistics')
export class CategoryStatistics {
  @Field(() => Int, { nullable: true })
  categoryId?: number

  @Field({ nullable: true })
  name?: string

  @Field(() => Int, { nullable: true })
  published?: number
}
