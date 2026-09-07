import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module, RepositoryModule } from '..'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [forwardRef(() => RepositoryModule), forwardRef(() => AwsS3Module)],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
