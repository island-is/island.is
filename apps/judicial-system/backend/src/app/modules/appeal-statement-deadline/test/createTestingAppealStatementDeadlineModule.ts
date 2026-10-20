import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import type { Message } from '@island.is/judicial-system/message'

import { queueMessagesAfterCommit } from '../../../middleware/queueMessagesAfterCommit'
import { CaseService } from '../../case'
import {
  AppealEventLogRepositoryService,
  AppealStatementDeadlineRepositoryService,
} from '../../repository'
import { AppealStatementDeadlineController } from '../appealStatementDeadline.controller'
import { AppealStatementDeadlineService } from '../appealStatementDeadline.service'

jest.mock('../../../middleware/queueMessagesAfterCommit')
jest.mock('../../case/case.service')
jest.mock('../../repository/services/appealEventLogRepository.service')
jest.mock('../../repository/services/appealStatementDeadlineRepository.service')

export const createTestingAppealStatementDeadlineModule = async () => {
  const appealStatementDeadlineModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig],
      }),
    ],
    controllers: [AppealStatementDeadlineController],
    providers: [
      SharedAuthModule,
      CaseService,
      AppealEventLogRepositoryService,
      AppealStatementDeadlineRepositoryService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      AppealStatementDeadlineService,
    ],
  }).compile()

  const appealEventLogRepositoryService =
    appealStatementDeadlineModule.get<AppealEventLogRepositoryService>(
      AppealEventLogRepositoryService,
    )

  const appealStatementDeadlineRepositoryService =
    appealStatementDeadlineModule.get<AppealStatementDeadlineRepositoryService>(
      AppealStatementDeadlineRepositoryService,
    )

  const sequelize = appealStatementDeadlineModule.get<Sequelize>(Sequelize)

  const appealStatementDeadlineController =
    appealStatementDeadlineModule.get<AppealStatementDeadlineController>(
      AppealStatementDeadlineController,
    )

  // Every message the module queues goes through the helper, so this is the
  // whole of what a request would send.
  const queuedMessagesAfterCommit: Message[] = []
  const mockQueueMessagesAfterCommit = queueMessagesAfterCommit as jest.Mock
  mockQueueMessagesAfterCommit.mockImplementation((...msgs: Message[]) => {
    queuedMessagesAfterCommit.push(...msgs)
  })

  appealStatementDeadlineModule.close()

  return {
    queuedMessagesAfterCommit,
    appealEventLogRepositoryService,
    appealStatementDeadlineRepositoryService,
    sequelize,
    appealStatementDeadlineController,
  }
}
