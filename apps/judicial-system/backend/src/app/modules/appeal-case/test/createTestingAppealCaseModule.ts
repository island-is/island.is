import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { CaseService } from '../../case'
import { LimitedAccessCaseService } from '../../case/limitedAccessCase.service'
import { EventService } from '../../event'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  CaseRepositoryService,
} from '../../repository'
import { UserService } from '../../user'
import { appealCaseModuleConfig } from '../appealCase.config'
import { AppealCaseController } from '../appealCase.controller'
import { AppealCaseService } from '../appealCase.service'
import { LimitedAccessAppealCaseController } from '../limitedAccessAppealCase.controller'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../case/case.service')
jest.mock('../../case/limitedAccessCase.service')
jest.mock('../../event/event.service')
jest.mock('../../user/user.service')
jest.mock('../../repository/services/appealCaseRepository.service')
jest.mock('../../repository/services/appealDecisionRepository.service')
jest.mock('../../repository/services/appealEventLogRepository.service')
jest.mock('../../repository/services/caseRepository.service')

export const createTestingAppealCaseModule = async () => {
  const appealCaseModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig, appealCaseModuleConfig],
      }),
    ],
    controllers: [AppealCaseController, LimitedAccessAppealCaseController],
    providers: [
      SharedAuthModule,
      CaseService,
      LimitedAccessCaseService,
      EventService,
      UserService,
      AppealCaseRepositoryService,
      AppealDecisionRepositoryService,
      AppealEventLogRepositoryService,
      CaseRepositoryService,
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
      AppealCaseService,
    ],
  }).compile()

  const appealCaseRepositoryService =
    appealCaseModule.get<AppealCaseRepositoryService>(
      AppealCaseRepositoryService,
    )

  const appealDecisionRepositoryService =
    appealCaseModule.get<AppealDecisionRepositoryService>(
      AppealDecisionRepositoryService,
    )

  const appealEventLogRepositoryService =
    appealCaseModule.get<AppealEventLogRepositoryService>(
      AppealEventLogRepositoryService,
    )

  const caseRepositoryService = appealCaseModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

  const userService = appealCaseModule.get<UserService>(UserService)

  const eventService = appealCaseModule.get<EventService>(EventService)

  const appealCaseService =
    appealCaseModule.get<AppealCaseService>(AppealCaseService)

  const appealCaseController =
    appealCaseModule.get<AppealCaseController>(AppealCaseController)

  const limitedAccessAppealCaseController =
    appealCaseModule.get<LimitedAccessAppealCaseController>(
      LimitedAccessAppealCaseController,
    )

  const sequelize = appealCaseModule.get<Sequelize>(Sequelize)

  appealCaseModule.close()

  return {
    appealCaseRepositoryService,
    appealDecisionRepositoryService,
    appealEventLogRepositoryService,
    caseRepositoryService,
    userService,
    eventService,
    appealCaseService,
    appealCaseController,
    limitedAccessAppealCaseController,
    sequelize,
  }
}
