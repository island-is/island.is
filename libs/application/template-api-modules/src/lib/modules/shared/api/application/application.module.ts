import { DynamicModule } from '@nestjs/common'
import { ApplicationService } from './application.service'

export class ApplicationModule {
  static register(): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [],
      providers: [ApplicationService],
      exports: [ApplicationService],
    }
  }
}
