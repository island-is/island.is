import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import { Message, MessageService } from '@island.is/judicial-system/message'

import { queueMessagesAfterCommit } from '../../../middleware'
import { AppealCaseService } from '../../appeal-case/appealCase.service'
import { CaseService } from '../../case'
import { CourtService } from '../../court'
import { EventLogService } from '../../event-log'
import {
  AppealEventLogRepositoryService,
  CaseDefendantPoliceCaseNumberRepositoryService,
  CaseFileRepositoryService,
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
jest.mock('../../../middleware/queueMessagesAfterCommit')
jest.mock('../../user/user.service')
jest.mock('../../court/court.service')
jest.mock('../../case/case.service')
jest.mock('../../repository/services/defendantRepository.service')
jest.mock('../../repository/services/defendantEventLogRepository.service')
jest.mock('../../repository/services/appealEventLogRepository.service')
jest.mock(
  '../../repository/services/caseDefendantPoliceCaseNumber.repository.service',
)
jest.mock('../../event-log/eventLog.service')
jest.mock('../../appeal-case/appealCase.service')

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
      AppealEventLogRepositoryService,
      CaseDefendantPoliceCaseNumberRepositoryService,
      EventLogService,
      AppealCaseService,
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
        },
      },
      {
        provide: CaseFileRepositoryService,
        useValue: {
          deleteAllForCivilClaimant: jest.fn(),
          deleteAllForCivilClaimantsOfCase: jest.fn(),
        },
      },
      DefendantService,
      CivilClaimantService,
    ],
  }).compile()

  const messageService = defendantModule.get<MessageService>(MessageService)

  const userService = defendantModule.get<UserService>(UserService)

  const courtService = defendantModule.get<CourtService>(CourtService)

  const appealCaseService =
    defendantModule.get<AppealCaseService>(AppealCaseService)

  const sequelize = defendantModule.get<Sequelize>(Sequelize)

  const defendantRepositoryService =
    defendantModule.get<DefendantRepositoryService>(DefendantRepositoryService)

  const defendantEventLogRepositoryService =
    defendantModule.get<DefendantEventLogRepositoryService>(
      DefendantEventLogRepositoryService,
    )

  const appealEventLogRepositoryService =
    defendantModule.get<AppealEventLogRepositoryService>(
      AppealEventLogRepositoryService,
    )

  const caseDefendantPoliceCaseNumberRepositoryService =
    defendantModule.get<CaseDefendantPoliceCaseNumberRepositoryService>(
      CaseDefendantPoliceCaseNumberRepositoryService,
    )

  const defendantService =
    defendantModule.get<DefendantService>(DefendantService)

  const defendantController =
    defendantModule.get<DefendantController>(DefendantController)

  const internalDefendantController =
    defendantModule.get<InternalDefendantController>(
      InternalDefendantController,
    )

  const limitedAccessDefendantController =
    defendantModule.get<LimitedAccessDefendantController>(
      LimitedAccessDefendantController,
    )

  const civilClaimantRepositoryService =
    defendantModule.get<CivilClaimantRepositoryService>(
      CivilClaimantRepositoryService,
    )

  const caseFileRepositoryService =
    defendantModule.get<CaseFileRepositoryService>(CaseFileRepositoryService)

  const civilClaimantService =
    defendantModule.get<CivilClaimantService>(CivilClaimantService)

  const civilClaimantController = defendantModule.get<CivilClaimantController>(
    CivilClaimantController,
  )

  const internalCivilClaimantController =
    defendantModule.get<InternalCivilClaimantController>(
      InternalCivilClaimantController,
    )

  // Every message the module queues goes through the helper, so this is the
  // whole of what a request would send
  const queuedMessagesAfterCommit: Message[] = []
  const mockQueueMessagesAfterCommit = queueMessagesAfterCommit as jest.Mock
  mockQueueMessagesAfterCommit.mockImplementation((...msgs: Message[]) => {
    queuedMessagesAfterCommit.push(...msgs)
  })

  defendantModule.close()

  return {
    queuedMessagesAfterCommit,
    messageService,
    userService,
    courtService,
    appealCaseService,
    sequelize,
    defendantRepositoryService,
    defendantEventLogRepositoryService,
    appealEventLogRepositoryService,
    caseDefendantPoliceCaseNumberRepositoryService,
    defendantService,
    defendantController,
    internalDefendantController,
    internalCivilClaimantController,
    limitedAccessDefendantController,
    civilClaimantService,
    civilClaimantController,
    civilClaimantRepositoryService,
    caseFileRepositoryService,
  }
}
