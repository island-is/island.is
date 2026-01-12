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
import { Victim } from '../../repository'
import { VictimController } from '../victim.controller'
import { VictimService } from '../victim.service'

jest.mock('../../case/case.service')

export const createTestingVictimModule = async () => {
  const victimModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig],
      }),
    ],
    controllers: [VictimController],
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
      {
        provide: getModelToken(Victim),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      VictimService,
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
    ],
  }).compile()

  const victimModel = await victimModule.resolve<typeof Victim>(
    getModelToken(Victim),
  )

  const victimController = victimModule.get<VictimController>(VictimController)

  victimModule.close()

  return {
    victimController,
    victimModel,
  }
}
