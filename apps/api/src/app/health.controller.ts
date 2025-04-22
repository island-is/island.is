import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'

import { CmsHealthIndicator } from '@island.is/cms'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private cmsHealthIndicator: CmsHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.cmsHealthIndicator.isHealthy()])
  }
}
