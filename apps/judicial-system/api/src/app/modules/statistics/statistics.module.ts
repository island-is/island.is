import { Module } from '@nestjs/common'

import { StatisticsResolver } from './statistics.resolver'

@Module({
  providers: [StatisticsResolver],
})
export class StatisticsModule {}
