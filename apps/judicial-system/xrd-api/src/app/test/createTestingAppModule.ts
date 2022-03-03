import { Test } from '@nestjs/testing'

import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'
import { LOGGER_PROVIDER, LoggingModule } from '@island.is/logging'

import { environment } from '../../environments'
import { AppController } from '../app.controller'
import { AppService } from '../app.service'

export const createTestingAppModule = async () => {
  const appModule = await Test.createTestingModule({
    imports: [LoggingModule, AuditTrailModule.register(environment.auditTrail)],
    controllers: [AppController],
    providers: [
      AppService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
    ],
  }).compile()

  const appController = appModule.get<AppController>(AppController)

  return appController
}
