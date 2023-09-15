import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { StatisticsResult } from '../models/statisticsResult.model'
import { StatisticsService } from './statistics.service'
import { Audit } from '@island.is/nest/audit'

@Resolver()
@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.consultationPortalApplication)
@Audit({ namespace: '@island.is/samradsgatt' })
export class StatisticsResolver {
  constructor(private statisticsResultService: StatisticsService) {}

  @Query(() => StatisticsResult, { name: 'consultationPortalStatistics' })
  async getStatistics(): Promise<StatisticsResult> {
    const statistics = await this.statisticsResultService.getStatistics()
    return statistics
  }
}
