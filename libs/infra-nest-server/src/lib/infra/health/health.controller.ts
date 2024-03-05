import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  SequelizeHealthIndicator,
} from '@nestjs/terminus'

import { type HealthCheckOptions, HealthCheckOptionsProviderKey } from './types'

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: SequelizeHealthIndicator,

    @Inject(HealthCheckOptionsProviderKey)
    private readonly healthCheckOptions: HealthCheckOptions,
  ) {}

  // route: /health/check
  @Get('check')
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const { timeout, database } = this.healthCheckOptions
    const healthChecks = []

    if (database) {
      healthChecks.push(() => {
        return this.db.pingCheck('database', { timeout })
      })
    }

    const healthCheck = await this.health.check(healthChecks)

    if (healthCheck.status !== 'ok') {
      throw new ServiceUnavailableException(healthCheck)
    }

    return healthCheck
  }
}
