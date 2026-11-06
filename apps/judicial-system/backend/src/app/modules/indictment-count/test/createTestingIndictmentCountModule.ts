import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { CaseService } from '../../case'
import {
  IndictmentCountRepositoryService,
  OffenseRepositoryService,
} from '../../repository'
import { IndictmentCountController } from '../indictmentCount.controller'
import { IndictmentCountService } from '../indictmentCount.service'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../case/case.service')
jest.mock('../../repository/services/indictmentCountRepository.service')
jest.mock('../../repository/services/offenseRepository.service')

export const createTestingIndictmentCountModule = async () => {
  const indictmentCountModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [sharedAuthModuleConfig] })],
    controllers: [IndictmentCountController],
    providers: [
      SharedAuthModule,
      CaseService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      IndictmentCountRepositoryService,
      OffenseRepositoryService,
      IndictmentCountService,
    ],
  }).compile()

  const indictmentCountRepositoryService =
    indictmentCountModule.get<IndictmentCountRepositoryService>(
      IndictmentCountRepositoryService,
    )

  const offenseRepositoryService =
    indictmentCountModule.get<OffenseRepositoryService>(
      OffenseRepositoryService,
    )

  const sequelize = indictmentCountModule.get<Sequelize>(Sequelize)

  const indictmentCountService =
    indictmentCountModule.get<IndictmentCountService>(IndictmentCountService)

  const indictmentCountController =
    indictmentCountModule.get<IndictmentCountController>(
      IndictmentCountController,
    )

  indictmentCountModule.close()

  return {
    sequelize,
    indictmentCountRepositoryService,
    offenseRepositoryService,
    indictmentCountService,
    indictmentCountController,
  }
}
