import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { MessageService } from '@island.is/judicial-system/message'

import { appModuleConfig } from '../app.config'
import { AppService } from '../app.service'

jest.mock('@island.is/judicial-system/message')

export const createTestingAppModule = async () => {
  const appModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [appModuleConfig] })],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      MessageService,
      AppService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const logger = appModule.get<Logger>(LOGGER_PROVIDER)
  const messageService = appModule.get(MessageService)
  const appService = appModule.get(AppService)

  return { logger, messageService, appService }
}
