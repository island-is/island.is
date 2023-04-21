import { StatisticsApi } from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'
import { StatisticsResult } from '../models/statisticsResult.model'

@Injectable()
export class StatisticsService {
  constructor(private statisticsApi: StatisticsApi) {}

  async getStatistics(): Promise<StatisticsResult> {
    const statistics = await this.statisticsApi.apiStatisticsGet()
    return statistics
  }
}
