import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { EmailService } from '@island.is/email-service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { CourtClientService } from '@island.is/judicial-system/court-client'

import {
  CaseRepositoryService,
  RobotLogRepositoryService,
} from '../../repository'
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
          warn: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: CaseRepositoryService,
        useValue: {
          findById: jest.fn().mockResolvedValue(null),
        },
      },
      {
        provide: RobotLogRepositoryService,
        useValue: {
          existsForCaseTypeAndElements: jest.fn(),
          create: jest.fn().mockResolvedValue({ id: '', seqNumber: 0 }),
          markDelivered: jest.fn(),
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

  const emailService = courtModule.get<EmailService>(EmailService)

  const courtService = courtModule.get<CourtService>(CourtService)

  const caseRepositoryService = courtModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

  courtModule.close()

  return {
    courtClientService,
    emailService,
    courtService,
    caseRepositoryService,
  }
}
