import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { HttpExceptionFilter } from '@island.is/judicial-system/auth'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

import { environment } from '../environments'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [AuditTrailModule.register(environment.auditTrail)],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
