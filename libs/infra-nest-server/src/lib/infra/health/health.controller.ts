import { Controller, Get, Inject, Res } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
} from '@nestjs/terminus'
import { Response } from 'express'

import { HealthCheckOptions, HealthCheckOptionsProviderKey } from './types'

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
  async check(@Res() res: Response) {
    const { timeout, database } = this.healthCheckOptions
    const healthChecks = []

    if (database) {
      healthChecks.push(() => {
        return this.db.pingCheck('database', { timeout })
      })
    }

    const healthCheck = await this.health.check(healthChecks)

    if (!healthCheck.status) {
      res.status(503).send(healthCheck)
    }

    res.status(200).send(healthCheck)
  }
}
