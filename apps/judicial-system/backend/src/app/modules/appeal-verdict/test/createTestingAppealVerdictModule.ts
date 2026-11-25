import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  auditTrailModuleConfig,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import { MessageService } from '@island.is/judicial-system/message'

import { CaseService } from '../../case'
import { FileService } from '../../file'
import { PoliceService } from '../../police'
import {
  AppealVerdictRepositoryService,
  Case,
  CaseRepositoryService,
} from '../../repository'
import { AppealVerdictController } from '../appealVerdict.controller'
import { AppealVerdictService } from '../appealVerdict.service'
import { InternalAppealVerdictController } from '../internalAppealVerdict.controller'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../../middleware/queueMessagesAfterCommit')
jest.mock('../../case/case.service')
jest.mock('../../police/police.service')
jest.mock('../../file', () => ({
  FileService: class FileService {
    getCaseFileFromS3 = jest.fn()
  },
}))
jest.mock('../../file/file.service', () => ({
  FileService: class FileService {
    getCaseFileFromS3 = jest.fn()
  },
}))
jest.mock('../../repository/services/appealVerdictRepository.service')
jest.mock('../../repository/services/caseRepository.service')

export const createTestingAppealVerdictModule = async () => {
  const appealVerdictModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig, auditTrailModuleConfig],
      }),
    ],
    controllers: [AppealVerdictController, InternalAppealVerdictController],
    providers: [
      SharedAuthModule,
      MessageService,
      CaseService,
      PoliceService,
      FileService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      AppealVerdictRepositoryService,
      CaseRepositoryService,
      AppealVerdictService,
      AuditTrailService,
    ],
  }).compile()

  const appealVerdictRepositoryService =
    appealVerdictModule.get<AppealVerdictRepositoryService>(
      AppealVerdictRepositoryService,
    )

  const caseRepositoryService = appealVerdictModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

  const mockFindOriginalAncestorId =
    caseRepositoryService.findOriginalAncestorId as jest.Mock
  mockFindOriginalAncestorId.mockImplementation((theCase: Case) =>
    Promise.resolve(theCase.splitCaseId ?? theCase.id),
  )

  const appealVerdictService =
    appealVerdictModule.get<AppealVerdictService>(AppealVerdictService)

  const policeService = appealVerdictModule.get<PoliceService>(PoliceService)

  const fileService = appealVerdictModule.get<FileService>(FileService)

  const appealVerdictController =
    appealVerdictModule.get<AppealVerdictController>(AppealVerdictController)

  const internalAppealVerdictController =
    appealVerdictModule.get<InternalAppealVerdictController>(
      InternalAppealVerdictController,
    )

  const sequelize = appealVerdictModule.get<Sequelize>(Sequelize)

  appealVerdictModule.close()

  return {
    appealVerdictController,
    internalAppealVerdictController,
    appealVerdictService,
    policeService,
    fileService,
    appealVerdictRepositoryService,
    caseRepositoryService,
    sequelize,
  }
}
