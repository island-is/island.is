import { DynamicModule } from '@nestjs/common'

import { HealthTestResolver } from './graphql'
import { HealthTestService } from './healthTest.service'

export class HealthTestModule {
  static register(): DynamicModule {
    return {
      module: HealthTestModule,
      providers: [HealthTestService, HealthTestResolver],
      exports: [],
    }
  }
}
