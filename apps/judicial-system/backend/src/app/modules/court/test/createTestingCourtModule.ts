import { mock } from 'jest-mock-extended'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { CourtClientService } from '@island.is/judicial-system/court-client'

import { RobotLog } from '../../repository'
import { courtModuleConfig } from '../court.config'
import { CourtService } from '../court.service'

export const createTestingCourtModule = async () => {
  const courtModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [courtModuleConfig],
      }),
    ],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(RobotLog),
        useValue: {
          create: jest.fn(),
          update: jest.fn(),
        },
      },
      CourtService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const courtClientService =
    courtModule.get<CourtClientService>(CourtClientService)

  const courtService = courtModule.get<CourtService>(CourtService)

  courtModule.close()

  return { courtClientService, courtService }
}
