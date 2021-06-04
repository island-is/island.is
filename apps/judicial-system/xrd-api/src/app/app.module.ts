import { Module } from '@nestjs/common'

import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

import { environment } from '../environments'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [AuditTrailModule.register(environment.auditTrail)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
