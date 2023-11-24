import { Module } from '@nestjs/common'

import { StatisticsClientModule } from '@island.is/clients/statistics'
import { StatisticsResolver } from './statistics.resolver'

@Module({
  imports: [StatisticsClientModule],
  providers: [StatisticsResolver],
})
export class StatisticsModule {}
