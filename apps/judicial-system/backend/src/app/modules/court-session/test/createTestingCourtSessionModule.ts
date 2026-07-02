import { mock } from 'jest-mock-extended'
import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { EventLogService } from '../../event-log'
import { FileService } from '../../file'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  CourtSessionRepositoryService,
  CourtSessionString,
} from '../../repository'
import { CourtSessionController } from '../courtSession.controller'
import { CourtSessionService } from '../courtSession.service'

jest.mock('../../repository/services/courtSessionRepository.service')
jest.mock('../../repository/services/appealDecisionRepository.service')
jest.mock('../../repository/services/appealCaseRepository.service')
jest.mock('../../repository/services/appealEventLogRepository.service')

export const createTestingCourtSessionModule = async () => {
  const courtSessionModule = await Test.createTestingModule({
    controllers: [CourtSessionController],
    providers: [
      CourtSessionRepositoryService,
      AppealDecisionRepositoryService,
      AppealCaseRepositoryService,
      AppealEventLogRepositoryService,
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
        provide: getModelToken(CourtSessionString),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
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

  const fileService = courtSessionModule.get<FileService>(FileService)

  const eventLogService =
    courtSessionModule.get<EventLogService>(EventLogService)

  const courtSessionController = courtSessionModule.get<CourtSessionController>(
    CourtSessionController,
  )

  // Event convergence reads existing APPEALED events; default to none so tests
  // that don't set it up don't blow up on the returned undefined.
  ;(appealEventLogRepositoryService.findAll as jest.Mock).mockResolvedValue([])

  courtSessionModule.close()

  return {
    sequelize,
    courtSessionRepositoryService,
    appealDecisionRepositoryService,
    appealCaseRepositoryService,
    appealEventLogRepositoryService,
    fileService,
    eventLogService,
    courtSessionController,
  }
}
