import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { CaseService } from '../../case'
import { AppealCourtSessionRepositoryService } from '../../repository'
import { AppealCourtSessionController } from '../appealCourtSession.controller'
import { AppealCourtSessionService } from '../appealCourtSession.service'

jest.mock('../../case/case.service')
jest.mock('../../repository/services/appealCourtSessionRepository.service')

export const createTestingAppealCourtSessionModule = async () => {
  const appealCourtSessionModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig],
      }),
    ],
    controllers: [AppealCourtSessionController],
    providers: [
      SharedAuthModule,
      CaseService,
      AppealCourtSessionRepositoryService,
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
      AppealCourtSessionService,
    ],
  }).compile()

  const appealCourtSessionRepositoryService =
    appealCourtSessionModule.get<AppealCourtSessionRepositoryService>(
      AppealCourtSessionRepositoryService,
    )

  const sequelize = appealCourtSessionModule.get<Sequelize>(Sequelize)

  const appealCourtSessionController =
    appealCourtSessionModule.get<AppealCourtSessionController>(
      AppealCourtSessionController,
    )

  appealCourtSessionModule.close()

  return {
    appealCourtSessionRepositoryService,
    sequelize,
    appealCourtSessionController,
  }
}
