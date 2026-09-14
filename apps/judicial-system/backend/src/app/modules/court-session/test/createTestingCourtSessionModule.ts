import { mock } from 'jest-mock-extended'
import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { EventLogService } from '../../event-log'
import { FileService } from '../../file'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  CaseRepositoryService,
  CourtDocumentRepositoryService,
  CourtSessionRepositoryService,
  CourtSessionStringRepositoryService,
  EventLogRepositoryService,
} from '../../repository'
import { CourtSessionController } from '../courtSession.controller'
import { CourtSessionService } from '../courtSession.service'

jest.mock('../../repository/services/courtSessionRepository.service')
jest.mock('../../repository/services/appealDecisionRepository.service')
jest.mock('../../repository/services/appealCaseRepository.service')
jest.mock('../../repository/services/appealEventLogRepository.service')
jest.mock('../../repository/services/caseRepository.service')
jest.mock('../../repository/services/courtDocumentRepository.service')
jest.mock('../../repository/services/eventLogRepository.service')

export const createTestingCourtSessionModule = async () => {
  const courtSessionModule = await Test.createTestingModule({
    controllers: [CourtSessionController],
    providers: [
      CourtSessionRepositoryService,
      AppealDecisionRepositoryService,
      AppealCaseRepositoryService,
      AppealEventLogRepositoryService,
      CaseRepositoryService,
      CourtDocumentRepositoryService,
      EventLogRepositoryService,
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
        provide: CourtSessionStringRepositoryService,
        useValue: {
          findByKey: jest.fn(),
          updateByKey: jest.fn(),
          create: jest.fn(),
          deleteAllForCourtSession: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      CourtSessionService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const sequelize = courtSessionModule.get<Sequelize>(Sequelize)

  const courtSessionRepositoryService =
    courtSessionModule.get<CourtSessionRepositoryService>(
      CourtSessionRepositoryService,
    )

  const appealDecisionRepositoryService =
    courtSessionModule.get<AppealDecisionRepositoryService>(
      AppealDecisionRepositoryService,
    )

  const appealCaseRepositoryService =
    courtSessionModule.get<AppealCaseRepositoryService>(
      AppealCaseRepositoryService,
    )

  const appealEventLogRepositoryService =
    courtSessionModule.get<AppealEventLogRepositoryService>(
      AppealEventLogRepositoryService,
    )

  const caseRepositoryService = courtSessionModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

  const courtDocumentRepositoryService =
    courtSessionModule.get<CourtDocumentRepositoryService>(
      CourtDocumentRepositoryService,
    )

  const eventLogRepositoryService =
    courtSessionModule.get<EventLogRepositoryService>(EventLogRepositoryService)

  const courtSessionStringRepositoryService =
    courtSessionModule.get<CourtSessionStringRepositoryService>(
      CourtSessionStringRepositoryService,
    )

  const fileService = courtSessionModule.get<FileService>(FileService)

  const eventLogService =
    courtSessionModule.get<EventLogService>(EventLogService)

  const courtSessionService =
    courtSessionModule.get<CourtSessionService>(CourtSessionService)

  const courtSessionController = courtSessionModule.get<CourtSessionController>(
    CourtSessionController,
  )

  // Event convergence reads existing APPEALED events; default to none so tests
  // that don't set it up don't blow up on the returned undefined.
  ;(appealEventLogRepositoryService.findAll as jest.Mock).mockResolvedValue([])
  // Same for the appeal cases the ruling-order cleanup checks before deleting a
  // ruling that was only ever pronounced orally.
  ;(appealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue([])
  // A new session records the cases merged into the case; default to none.
  ;(caseRepositoryService.findAllMergedToCase as jest.Mock).mockResolvedValue(
    [],
  )

  courtSessionModule.close()

  return {
    sequelize,
    courtSessionRepositoryService,
    appealDecisionRepositoryService,
    appealCaseRepositoryService,
    appealEventLogRepositoryService,
    caseRepositoryService,
    courtDocumentRepositoryService,
    eventLogRepositoryService,
    courtSessionStringRepositoryService,
    fileService,
    eventLogService,
    courtSessionService,
    courtSessionController,
  }
}
