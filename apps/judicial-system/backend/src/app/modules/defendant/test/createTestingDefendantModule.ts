import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
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
  CivilClaimant,
  DefendantEventLogRepositoryService,
  DefendantRepositoryService,
} from '../../repository'
import { UserService } from '../../user'
import { CivilClaimantController } from '../civilClaimant.controller'
import { CivilClaimantService } from '../civilClaimant.service'
import { DefendantController } from '../defendant.controller'
import { DefendantService } from '../defendant.service'
import { InternalDefendantController } from '../internalDefendant.controller'
import { LimitedAccessDefendantController } from '../limitedAccessDefendant.controller'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../user/user.service')
jest.mock('../../court/court.service')
jest.mock('../../case/case.service')
jest.mock('../../repository/services/defendantRepository.service')
jest.mock('../../repository/services/defendantEventLogRepository.service')
jest.mock('../../event-log/eventLog.service')

export const createTestingDefendantModule = async () => {
  const defendantModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [sharedAuthModuleConfig] })],
    controllers: [
      DefendantController,
      LimitedAccessDefendantController,
      InternalDefendantController,
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
        provide: getModelToken(CivilClaimant),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
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

  const defendantRepositoryService =
    defendantModule.get<DefendantRepositoryService>(DefendantRepositoryService)

  const defendantEventLogRepositoryService =
    defendantModule.get<DefendantEventLogRepositoryService>(
      DefendantEventLogRepositoryService,
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

  const civilClaimantModel = await defendantModule.resolve<
    typeof CivilClaimant
  >(getModelToken(CivilClaimant))

  const civilClaimantService =
    defendantModule.get<CivilClaimantService>(CivilClaimantService)

  const civilClaimantController = defendantModule.get<CivilClaimantController>(
    CivilClaimantController,
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
    defendantService,
    defendantController,
    internalDefendantController,
    limitedAccessDefendantController,
    civilClaimantService,
    civilClaimantController,
    civilClaimantModel,
  }
}
