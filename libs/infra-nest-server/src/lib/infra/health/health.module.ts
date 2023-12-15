import { DynamicModule } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from './health.controller'
import { HealthCheckOptions, HealthCheckOptionsProviderKey } from './types'

const defaultOptions: HealthCheckOptions = {
  gracefulShutdownTimeoutMs: 60 * 1000,
  timeout: 1000,
  checks: {},
}

export class HealthModule {
  static register(options?: HealthCheckOptions): DynamicModule {
    const { gracefulShutdownTimeoutMs, timeout, checks } = {
      ...defaultOptions,
      ...options,
    }

    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [
        {
          // Make the health check options available for injection
          provide: HealthCheckOptionsProviderKey,
          useValue: {
            timeout,
            checks,
          } as HealthCheckOptions,
        },
      ],
      imports: [
        TerminusModule.forRoot({
          gracefulShutdownTimeoutMs,
        }),
      ],
    }
  }
}
