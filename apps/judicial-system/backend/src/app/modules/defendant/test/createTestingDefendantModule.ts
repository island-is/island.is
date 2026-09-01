import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import {
  addMessagesToQueue,
  Message,
  MessageService,
} from '@island.is/judicial-system/message'

import { CaseService } from '../../case'
import { CourtService } from '../../court'
import { EventLogService } from '../../event-log'
import {
  CaseDefendantPoliceCaseNumberRepositoryService,
  CivilClaimantRepositoryService,
  DefendantEventLogRepositoryService,
  DefendantRepositoryService,
} from '../../repository'
import { UserService } from '../../user'
import { CivilClaimantController } from '../civilClaimant.controller'
import { CivilClaimantService } from '../civilClaimant.service'
import { DefendantController } from '../defendant.controller'
import { DefendantService } from '../defendant.service'
import { InternalCivilClaimantController } from '../internalCivilClaimant.controller'
import { InternalDefendantController } from '../internalDefendant.controller'
import { LimitedAccessDefendantController } from '../limitedAccessDefendant.controller'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../user/user.service')
jest.mock('../../court/court.service')
jest.mock('../../case/case.service')
jest.mock('../../repository/services/defendantRepository.service')
jest.mock('../../repository/services/defendantEventLogRepository.service')
jest.mock(
  '../../repository/services/caseDefendantPoliceCaseNumber.repository.service',
)
jest.mock('../../event-log/eventLog.service')

export const createTestingDefendantModule = async () => {
  const defendantModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [sharedAuthModuleConfig] })],
    controllers: [
      DefendantController,
      LimitedAccessDefendantController,
      InternalDefendantController,
      InternalCivilClaimantController,
      CivilClaimantController,
    ],
    providers: [
      SharedAuthModule,
      MessageService,
      UserService,
      CourtService,
      CaseService,
      DefendantRepositoryService,
      DefendantEventLogRepositoryService,
      CaseDefendantPoliceCaseNumberRepositoryService,
      EventLogService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      {
        provide: CivilClaimantRepositoryService,
        useValue: {
          create: jest.fn(),
          updateByIdAndCase: jest.fn(),
          deleteByIdAndCase: jest.fn(),
          deleteAllForCase: jest.fn(),
          findLatestBySpokespersonNationalId: jest.fn(),
        },
      },
      DefendantService,
      CivilClaimantService,
    ],
  }).compile()

  const messageService = defendantModule.get<MessageService>(MessageService)

  const userService = defendantModule.get<UserService>(UserService)

  const courtService = defendantModule.get<CourtService>(CourtService)

  const sequelize = defendantModule.get<Sequelize>(Sequelize)

  const defendantRepositoryService = defendantModule.get<DefendantRepositoryService>(
    DefendantRepositoryService,
  )

  const defendantEventLogRepositoryService = defendantModule.get<DefendantEventLogRepositoryService>(
    DefendantEventLogRepositoryService,
  )

  const caseDefendantPoliceCaseNumberRepositoryService = defendantModule.get<CaseDefendantPoliceCaseNumberRepositoryService>(
    CaseDefendantPoliceCaseNumberRepositoryService,
  )

  const defendantService = defendantModule.get<DefendantService>(
    DefendantService,
  )

  const defendantController = defendantModule.get<DefendantController>(
    DefendantController,
  )

  const internalDefendantController = defendantModule.get<InternalDefendantController>(
    InternalDefendantController,
  )

  const limitedAccessDefendantController = defendantModule.get<LimitedAccessDefendantController>(
    LimitedAccessDefendantController,
  )

  const civilClaimantRepositoryService = defendantModule.get<CivilClaimantRepositoryService>(
    CivilClaimantRepositoryService,
  )

  const civilClaimantService = defendantModule.get<CivilClaimantService>(
    CivilClaimantService,
  )

  const civilClaimantController = defendantModule.get<CivilClaimantController>(
    CivilClaimantController,
  )

  const internalCivilClaimantController = defendantModule.get<InternalCivilClaimantController>(
    InternalCivilClaimantController,
  )

  const queuedMessages: Message[] = []
  const mockAddMessageToQueue = addMessagesToQueue as jest.Mock
  mockAddMessageToQueue.mockImplementation((...msgs: Message[]) => {
    queuedMessages.push(...msgs)
  })

  defendantModule.close()

  return {
    queuedMessages,
    messageService,
    userService,
    courtService,
    sequelize,
    defendantRepositoryService,
    defendantEventLogRepositoryService,
    caseDefendantPoliceCaseNumberRepositoryService,
    defendantService,
    defendantController,
    internalDefendantController,
    internalCivilClaimantController,
    limitedAccessDefendantController,
    civilClaimantService,
    civilClaimantController,
    civilClaimantRepositoryService,
  }
}
