import { Get } from '@nestjs/common'

export class HealthController {
  @Get('liveness')
  liveness() {
    return { ok: true }
  }
  @Get('readiness')
  readiness() {
    return { ok: true }
  }
}
