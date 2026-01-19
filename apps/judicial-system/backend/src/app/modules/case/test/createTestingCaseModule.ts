import { mock } from 'jest-mock-extended'
import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { IntlService } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'
import { signingModuleConfig, SigningService } from '@island.is/dokobit-signing'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule, ConfigType } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import { MessageService } from '@island.is/judicial-system/message'

import { AwsS3Service } from '../../aws-s3'
import { CourtService } from '../../court'
import { CourtSessionService } from '../../court-session'
import { CivilClaimantService } from '../../defendant'
import { DefendantService } from '../../defendant'
import { EventService } from '../../event'
import { EventLogService } from '../../event-log/eventLog.service'
import { FileService } from '../../file'
import { IndictmentCountService } from '../../indictment-count'
import { PoliceService } from '../../police'
import {
  CaseArchiveRepositoryService,
  CaseRepositoryService,
  CaseString,
  DateLog,
} from '../../repository'
import { SubpoenaService } from '../../subpoena'
import { UserService } from '../../user'
import { caseModuleConfig } from '../case.config'
import { CaseController } from '../case.controller'
import { CaseService } from '../case.service'
import { InternalCaseController } from '../internalCase.controller'
import { InternalCaseService } from '../internalCase.service'
import { LimitedAccessCaseController } from '../limitedAccessCase.controller'
import { LimitedAccessCaseService } from '../limitedAccessCase.service'
import { PdfService } from '../pdf.service'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../court/court.service')
jest.mock('../../police/police.service')
jest.mock('../../event/event.service')
jest.mock('../../event-log/eventLog.service')
jest.mock('../../user/user.service')
jest.mock('../../file/file.service')
jest.mock('../../aws-s3/awsS3.service')
jest.mock('../../defendant/defendant.service')
jest.mock('../../defendant/civilClaimant.service')
jest.mock('../../subpoena/subpoena.service')
jest.mock('../../indictment-count/indictmentCount.service')
jest.mock('../../repository/services/caseRepository.service')
jest.mock('../../repository/services/caseArchiveRepository.service')
jest.mock('../../court-session/courtSession.service')

export const createTestingCaseModule = async () => {
  const caseModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig, signingModuleConfig, caseModuleConfig],
      }),
    ],
    controllers: [
      CaseController,
      InternalCaseController,
      LimitedAccessCaseController,
    ],
    providers: [
      SharedAuthModule,
      MessageService,
      EventLogService,
      CourtService,
      PoliceService,
      UserService,
      FileService,
      AwsS3Service,
      EventService,
      SigningService,
      DefendantService,
      CivilClaimantService,
      IndictmentCountService,
      SubpoenaService,
      CaseRepositoryService,
      CaseArchiveRepositoryService,
      CourtSessionService,
      {
        provide: IntlService,
        useValue: {
          useIntl: async () => ({
            formatMessage: createTestIntl({
              onError: jest.fn(),
              locale: 'is-IS',
            }).formatMessage,
          }),
        },
      },
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
      {
        provide: getModelToken(DateLog),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
        },
      },
      {
        provide: getModelToken(CaseString),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
        },
      },
      CaseService,
      InternalCaseService,
      LimitedAccessCaseService,
      PdfService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const messageService = caseModule.get<MessageService>(MessageService)

  const eventLogService = caseModule.get<EventLogService>(EventLogService)

  const courtService = caseModule.get<CourtService>(CourtService)

  const policeService = caseModule.get<PoliceService>(PoliceService)

  const userService = caseModule.get<UserService>(UserService)

  const fileService = caseModule.get<FileService>(FileService)

  const awsS3Service = caseModule.get<AwsS3Service>(AwsS3Service)

  const defendantService = caseModule.get<DefendantService>(DefendantService)

  const subpoenaService = caseModule.get<SubpoenaService>(SubpoenaService)

  const civilClaimantService =
    caseModule.get<CivilClaimantService>(CivilClaimantService)

  const indictmentCountService = caseModule.get<IndictmentCountService>(
    IndictmentCountService,
  )

  const caseRepositoryService = caseModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

  const caseArchiveRepositoryService =
    caseModule.get<CaseArchiveRepositoryService>(CaseArchiveRepositoryService)

  const logger = caseModule.get<Logger>(LOGGER_PROVIDER)

  const sequelize = caseModule.get<Sequelize>(Sequelize)

  const dateLogModel = caseModule.get<typeof DateLog>(getModelToken(DateLog))

  const caseStringModel = caseModule.get<typeof CaseString>(
    getModelToken(CaseString),
  )

  const courtSessionService =
    caseModule.get<CourtSessionService>(CourtSessionService)

  const caseConfig = caseModule.get<ConfigType<typeof caseModuleConfig>>(
    caseModuleConfig.KEY,
  )

  const caseService = caseModule.get<CaseService>(CaseService)

  const internalCaseService =
    caseModule.get<InternalCaseService>(InternalCaseService)

  const limitedAccessCaseService = caseModule.get<LimitedAccessCaseService>(
    LimitedAccessCaseService,
  )

  const caseController = caseModule.get<CaseController>(CaseController)

  const internalCaseController = caseModule.get<InternalCaseController>(
    InternalCaseController,
  )

  const limitedAccessCaseController =
    caseModule.get<LimitedAccessCaseController>(LimitedAccessCaseController)

  caseModule.close()

  return {
    messageService,
    eventLogService,
    courtService,
    policeService,
    userService,
    fileService,
    awsS3Service,
    defendantService,
    subpoenaService,
    civilClaimantService,
    indictmentCountService,
    caseRepositoryService,
    caseArchiveRepositoryService,
    courtSessionService,
    logger,
    sequelize,
    dateLogModel,
    caseStringModel,
    caseConfig,
    caseService,
    internalCaseService,
    limitedAccessCaseService,
    caseController,
    internalCaseController,
    limitedAccessCaseController,
  }
}
