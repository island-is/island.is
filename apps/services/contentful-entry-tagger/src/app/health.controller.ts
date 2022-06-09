import { Controller, Get } from '@nestjs/common'

@Controller()
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
