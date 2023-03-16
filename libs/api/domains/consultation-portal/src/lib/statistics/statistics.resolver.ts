import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { StatisticsResult } from '../models/statisticsResult.model'
import { StatisticsResultService } from './statistics.service'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class StatisticsResultResolver {
  constructor(private statisticsResultService: StatisticsResultService) {}

  @Query(() => StatisticsResult, { name: 'consultationPortalStatistics' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getStatistics(): Promise<StatisticsResult> {
    const statistics = await this.statisticsResultService.getStatistics()
    return statistics
  }
}
