import { Test } from '@nestjs/testing'

import { CourtClientService } from '@island.is/judicial-system/court-client'

import { DATE_FACTORY } from '../../../factories'
import { CourtService } from '../court.service'

jest.mock('@island.is/judicial-system/court-client')

export const createTestingCourtModule = async () => {
  const courtModule = await Test.createTestingModule({
    providers: [
      CourtClientService,
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
