import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CategoryStatistics } from './categoryStatistics.model'

@ObjectType('ProviderStatisticsCategoryBreakdown')
export class ProviderStatisticsCategoryBreakdown {
  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => [CategoryStatistics], { nullable: true })
  categoryStatistics?: Array<CategoryStatistics>
}
