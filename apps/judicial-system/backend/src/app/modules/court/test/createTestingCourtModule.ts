import { Test } from '@nestjs/testing'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { Logger,LOGGER_PROVIDER } from '@island.is/logging'

import { DATE_FACTORY } from '../../../factories'
import { EventService } from '../../event'
import { CourtService } from '../court.service'

jest.mock('@island.is/judicial-system/court-client')
jest.mock('../../event/event.service')

export const createTestingCourtModule = async () => {
  const courtModule = await Test.createTestingModule({
    providers: [
      CourtClientService,
      EventService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: DATE_FACTORY, useFactory: jest.fn },
      CourtService,
    ],
  }).compile()

  const courtClientService = courtModule.get<CourtClientService>(
    CourtClientService,
  )

  const today = courtModule.get(DATE_FACTORY)

  const courtService = courtModule.get<CourtService>(CourtService)

  return { courtClientService, today, courtService }
}
