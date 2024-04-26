import { StatisticsClientService } from '@island.is/clients/statistics'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { StatisticsQueryInput } from './dto/statistics-query.input'
import { StatisticsQueryResponse } from './models/statistics-query.model'

@Resolver()
export class StatisticsResolver {
  constructor(private readonly service: StatisticsClientService) {}

  @Query(() => StatisticsQueryResponse, { name: 'getStatisticsByKeys' })
  async getStatisticsByKeys(
    @Args('input') input: StatisticsQueryInput,
  ): Promise<StatisticsQueryResponse> {
    return this.service.getMultipleStatistics(input)
  }
}
