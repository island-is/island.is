import { Controller, Get } from '@nestjs/common'

@Controller()
export class HealthController {
  @Get('liveness')
  liveness() {
    return { ok: true }
  }
}
