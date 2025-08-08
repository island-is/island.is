import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { CaseService } from '../../case'
import { Verdict } from '../models/verdict.model'
import { VerdictController } from '../verdict.controller'
import { VerdictService } from '../verdict.service'

jest.mock('../../case/case.service')

export const createTestingVerdictModule = async () => {
  const verdictModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig],
      }),
    ],
    controllers: [VerdictController],
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
      {
        provide: getModelToken(Verdict),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      VerdictService,
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
    ],
  }).compile()

  const verdictModel = await verdictModule.resolve<typeof Verdict>(
    getModelToken(Verdict),
  )

  const verdictController =
    verdictModule.get<VerdictController>(VerdictController)

  const sequelize = verdictModule.get<Sequelize>(Sequelize)

  verdictModule.close()

  return {
    verdictController,
    verdictModel,
    sequelize,
  }
}
