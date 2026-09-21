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
import { FileService } from '../../file'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  CaseRepositoryService,
  DefendantRepositoryService,
  VerdictRepositoryService,
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
jest.mock('../../file/file.service')
jest.mock('../../user/user.service')
jest.mock('../../repository/services/appealCaseRepository.service')
jest.mock('../../repository/services/appealDecisionRepository.service')
jest.mock('../../repository/services/appealEventLogRepository.service')
jest.mock('../../repository/services/caseRepository.service')
jest.mock('../../repository/services/defendantRepository.service')
jest.mock('../../repository/services/verdictRepository.service')

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
      FileService,
      UserService,
      AppealCaseRepositoryService,
      AppealDecisionRepositoryService,
      AppealEventLogRepositoryService,
      CaseRepositoryService,
      DefendantRepositoryService,
      VerdictRepositoryService,
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

  const verdictRepositoryService =
    appealCaseModule.get<VerdictRepositoryService>(VerdictRepositoryService)

  const defendantRepositoryService =
    appealCaseModule.get<DefendantRepositoryService>(DefendantRepositoryService)

  const userService = appealCaseModule.get<UserService>(UserService)

  const eventService = appealCaseModule.get<EventService>(EventService)

  const fileService = appealCaseModule.get<FileService>(FileService)

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
    defendantRepositoryService,
    verdictRepositoryService,
    userService,
    eventService,
    fileService,
    appealCaseService,
    appealCaseController,
    limitedAccessAppealCaseController,
    sequelize,
  }
}
