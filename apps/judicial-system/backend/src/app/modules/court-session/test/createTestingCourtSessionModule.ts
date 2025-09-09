import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSessionRepositoryService } from '../../repository'
import { CourtSessionController } from '../courtSession.controller'
import { CourtSessionService } from '../courtSession.service'

jest.mock('../../repository/services/courtSessionRepository.service')

export const createTestingCourtSessionModule = async () => {
  const courtSessionModule = await Test.createTestingModule({
    controllers: [CourtSessionController],
    providers: [
      CourtSessionRepositoryService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        },
      },
      CourtSessionService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const courtSessionRepositoryService =
    courtSessionModule.get<CourtSessionRepositoryService>(
      CourtSessionRepositoryService,
    )

  const courtSessionController = courtSessionModule.get<CourtSessionController>(
    CourtSessionController,
  )

  courtSessionModule.close()

  return {
    courtSessionRepositoryService,
    courtSessionController,
  }
}
