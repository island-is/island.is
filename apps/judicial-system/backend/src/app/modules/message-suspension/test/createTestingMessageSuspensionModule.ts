import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { MessageSuspensionRepositoryService } from '../../repository'
import { InternalMessageSuspensionController } from '../internalMessageSuspension.controller'
import { MessageSuspensionController } from '../messageSuspension.controller'
import { MessageSuspensionService } from '../messageSuspension.service'

export const createTestingMessageSuspensionModule = async () => {
  const messageSuspensionModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig],
      }),
    ],
    controllers: [
      MessageSuspensionController,
      InternalMessageSuspensionController,
    ],
    providers: [
      SharedAuthModule,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      MessageSuspensionService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const messageSuspensionRepositoryService =
    messageSuspensionModule.get<MessageSuspensionRepositoryService>(
      MessageSuspensionRepositoryService,
    )

  const messageSuspensionService =
    messageSuspensionModule.get<MessageSuspensionService>(
      MessageSuspensionService,
    )

  const messageSuspensionController =
    messageSuspensionModule.get<MessageSuspensionController>(
      MessageSuspensionController,
    )

  const internalMessageSuspensionController =
    messageSuspensionModule.get<InternalMessageSuspensionController>(
      InternalMessageSuspensionController,
    )

  messageSuspensionModule.close()

  return {
    messageSuspensionRepositoryService,
    messageSuspensionService,
    messageSuspensionController,
    internalMessageSuspensionController,
  }
}
