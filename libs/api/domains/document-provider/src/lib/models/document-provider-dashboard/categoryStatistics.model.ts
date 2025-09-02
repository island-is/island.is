import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentProviderCategoryStatistics')
export class CategoryStatistics {
  @Field(() => Int)
  categoryId?: number

  @Field()
  name?: string

  @Field(() => Int, { nullable: true })
  published?: number
}
