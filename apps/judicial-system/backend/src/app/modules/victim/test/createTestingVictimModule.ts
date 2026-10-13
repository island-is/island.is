import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { CaseService } from '../../case'
import { VictimRepositoryService } from '../../repository'
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
        provide: VictimRepositoryService,
        useValue: {
          findById: jest.fn(),
          create: jest.fn(),
          updateByIdAndCase: jest.fn(),
          deleteByIdAndCase: jest.fn(),
        },
      },
      VictimService,
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
    ],
  }).compile()

  const victimRepositoryService = victimModule.get<VictimRepositoryService>(
    VictimRepositoryService,
  )

  const victimController = victimModule.get<VictimController>(VictimController)

  victimModule.close()

  return {
    victimController,
    victimRepositoryService,
  }
}
