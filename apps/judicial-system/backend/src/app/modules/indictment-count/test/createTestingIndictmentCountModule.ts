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
import { IndictmentCount, Offense } from '../../repository'
import { IndictmentCountController } from '../indictmentCount.controller'
import { IndictmentCountService } from '../indictmentCount.service'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../case/case.service')

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
      {
        provide: getModelToken(IndictmentCount),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      {
        provide: getModelToken(Offense),
        useValue: {
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
        },
      },
      IndictmentCountService,
    ],
  }).compile()

  const indictmentCountModel = await indictmentCountModule.resolve<
    typeof IndictmentCount
  >(getModelToken(IndictmentCount))

  const offenseModel = await indictmentCountModule.resolve<typeof Offense>(
    getModelToken(Offense),
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
    offenseModel,
    indictmentCountModel,
    indictmentCountService,
    indictmentCountController,
  }
}
