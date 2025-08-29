import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { ProviderStatisticsBreakdown } from './providerStatisticsBreakdown.model'

@ObjectType('ProviderStatisticsBreakdownPaginationResponse')
export class ProviderStatisticsBreakdownPaginationResponse {
  @Field(() => Int)
  totalCount!: number

  @Field(() => [ProviderStatisticsBreakdown])
  items!: Array<ProviderStatisticsBreakdown>
}
