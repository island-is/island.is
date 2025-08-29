import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { ProviderStatisticsCategoryBreakdown } from './ProviderStatisticsCategoryBreakdown.model'
@ObjectType('ProviderStatisticsCategoryBreakdownPaginationResponse')
export class ProviderStatisticsCategoryBreakdownPaginationResponse {
  @Field(() => Int)
  totalCount!: number

  @Field(() => [ProviderStatisticsCategoryBreakdown])
  items!: Array<ProviderStatisticsCategoryBreakdown>
}
