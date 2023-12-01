import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from './health.controller'

@Module({
  imports: [
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 3 * 60 * 1000, // 3 minutes
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
