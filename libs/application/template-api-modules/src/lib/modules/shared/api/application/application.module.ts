import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { HistoryModule } from '@island.is/application/api/history'
import { Module } from '@nestjs/common'
import { ApplicationService } from './application.service'

@Module({
  imports: [ApplicationApiCoreModule, HistoryModule],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
