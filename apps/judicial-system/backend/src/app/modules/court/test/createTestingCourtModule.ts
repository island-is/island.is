import { Test } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { CourtClientService } from '@island.is/judicial-system/court-client'

import { CourtService } from '../court.service'

export const createTestingCourtModule = async () => {
  const courtModule = await Test.createTestingModule({
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
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

  const courtClientService = courtModule.get<CourtClientService>(
    CourtClientService,
  )

  const courtService = courtModule.get<CourtService>(CourtService)

  return { courtClientService, courtService }
}
