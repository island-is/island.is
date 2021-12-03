import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

import { environment } from '../../environments'
import { AppService } from '../app.service'
import { AppController } from '../app.controller'

export const createTestingAppModule = async () => {
  const appModule = await Test.createTestingModule({
    imports: [LoggingModule, AuditTrailModule.register(environment.auditTrail)],
    controllers: [AppController],
    providers: [AppService],
  }).compile()

  const appController = appModule.get<AppController>(AppController)

  return appController
}
