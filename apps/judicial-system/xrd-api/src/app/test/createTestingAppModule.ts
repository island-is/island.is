import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuditTrailService,
  AUDIT_TRAIL_OPTIONS,
} from '@island.is/judicial-system/audit-trail'

import { AppService } from '../app.service'
import { AppController } from '../app.controller'

export const createTestingAppModule = async () => {
  const appModule = await Test.createTestingModule({
    controllers: [AppController],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: AUDIT_TRAIL_OPTIONS, useValue: { useGenericLogger: true } },
      AuditTrailService,
      AppService,
    ],
  }).compile()

  const appController = appModule.get<AppController>(AppController)

  return appController
}
