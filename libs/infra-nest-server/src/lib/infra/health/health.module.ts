import { DynamicModule } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from './health.controller'
import { HealthCheckOptions, HealthCheckOptionsProviderKey } from './types'

const defaultOptions: HealthCheckOptions = {
  timeout: 1000,
}

export class HealthModule {
  static register(options?: HealthCheckOptions): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [
        {
          // Make the health check options available for injection
          provide: HealthCheckOptionsProviderKey,
          useValue: {
            ...defaultOptions,
            ...options,
          } as HealthCheckOptions,
        },
      ],
      imports: [TerminusModule.forRoot()],
    }
  }
}
