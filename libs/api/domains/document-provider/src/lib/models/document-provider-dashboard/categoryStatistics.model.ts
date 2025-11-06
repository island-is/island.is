import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentProviderDashboardCategoryStatistics')
export class DocumentProviderDashboardCategoryStatistics {
  @Field(() => Int, { nullable: true })
  categoryId?: number

  @Field({ nullable: true })
  name?: string

  @Field(() => Int, { nullable: true })
  published?: number
}
