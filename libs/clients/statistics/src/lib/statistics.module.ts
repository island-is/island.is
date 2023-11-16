import { Module } from '@nestjs/common'
import { StatisticsClientService } from './statistics.service'
import { enhancedFetch } from './fetchConfig'

@Module({
  providers: [enhancedFetch, StatisticsClientService],
  exports: [StatisticsClientService],
})
export class StatisticsClientModule {}
