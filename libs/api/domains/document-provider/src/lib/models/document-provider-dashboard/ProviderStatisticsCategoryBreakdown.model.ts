import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CategoryStatistics } from './categoryStatistics.model'

@ObjectType('ProviderStatisticsCategoryBreakdown')
export class ProviderStatisticsCategoryBreakdown {
  @Field(() => Int)
  year?: number

  @Field(() => Int)
  month?: number

  @Field(() => [CategoryStatistics], { nullable: true })
  categoryStatistics?: Array<CategoryStatistics>
}
