import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { DynamicModule } from '@nestjs/common'
import { ApplicationService } from './application.service'

export class ApplicationModule {
  static register(): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [ApplicationApiCoreModule],
      providers: [ApplicationService],
      exports: [ApplicationService],
    }
  }
}
