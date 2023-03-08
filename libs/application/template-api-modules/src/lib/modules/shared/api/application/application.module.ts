import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { HistoryModule } from '@island.is/application/api/history'
import { DynamicModule } from '@nestjs/common'
import { ApplicationService } from './application.service'

export class ApplicationModule {
  static register(): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [ApplicationApiCoreModule, HistoryModule],
      providers: [ApplicationService],
      exports: [ApplicationService],
    }
  }
}
