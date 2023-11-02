import { StatisticsApi } from '@island.is/clients/consultation-portal'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { StatisticsResult } from '../models/statisticsResult.model'
import type { Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'

@Injectable()
export class StatisticsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private statisticsApi: StatisticsApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'statistics_service',
    }
    this.logger.error(errorDetail || 'Statistics Service Error', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  async getStatistics(): Promise<StatisticsResult> {
    const response = await this.statisticsApi
      .apiStatisticsGet()
      .catch((e) => this.handle4xx(e, 'failed to get statistics'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }
}
