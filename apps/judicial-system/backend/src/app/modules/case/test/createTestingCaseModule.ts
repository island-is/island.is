import { uuid } from 'uuidv4'
import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'

import { ConfigModule, ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { IntlService } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'
import { signingModuleConfig, SigningService } from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { MessageService } from '@island.is/judicial-system/message'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CourtService } from '../../court'
import { PoliceService } from '../../police'
import { EventService } from '../../event'
import { UserService } from '../../user'
import { FileService } from '../../file'
import { AwsS3Service } from '../../aws-s3'
import { DefendantService } from '../../defendant'
import { Case } from '../models/case.model'
import { CaseArchive } from '../models/caseArchive.model'
import { caseModuleConfig } from '../case.config'
import { CaseService } from '../case.service'
import { LimitedAccessCaseService } from '../limitedAccessCase.service'
import { CaseController } from '../case.controller'
import { InternalCaseController } from '../internalCase.controller'
import { LimitedAccessCaseController } from '../limitedAccessCase.controller'

jest.mock('@island.is/email-service')
jest.mock('@island.is/judicial-system/message')
jest.mock('../../court/court.service')
jest.mock('../../police/police.service')
jest.mock('../../event/event.service')
jest.mock('../../user/user.service')
jest.mock('../../file/file.service')
jest.mock('../../aws-s3/awsS3.service')
jest.mock('../../defendant/defendant.service')

export const createTestingCaseModule = async () => {
  const caseModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
      ConfigModule.forRoot({ load: [signingModuleConfig, caseModuleConfig] }),
    ],
    controllers: [
      CaseController,
      InternalCaseController,
      LimitedAccessCaseController,
    ],
    providers: [
      MessageService,
      CourtService,
      PoliceService,
      UserService,
      FileService,
      AwsS3Service,
      EventService,
      SigningService,
      DefendantService,
      {
        provide: EmailService,
        useValue: { sendEmail: jest.fn(async () => uuid()) },
      },
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
          error: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      {
        provide: getModelToken(Case),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
        },
      },
      {
        provide: getModelToken(CaseArchive),
        useValue: { create: jest.fn() },
      },
      CaseService,
      LimitedAccessCaseService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const messageService = caseModule.get<MessageService>(MessageService)

  const courtService = caseModule.get<CourtService>(CourtService)

  const policeService = caseModule.get<PoliceService>(PoliceService)

  const userService = caseModule.get<UserService>(UserService)

  const fileService = caseModule.get<FileService>(FileService)

  const awsS3Service = caseModule.get<AwsS3Service>(AwsS3Service)

  const defendantService = caseModule.get<DefendantService>(DefendantService)

  const logger = caseModule.get<Logger>(LOGGER_PROVIDER)

  const sequelize = caseModule.get<Sequelize>(Sequelize)

  const caseModel = caseModule.get<typeof Case>(getModelToken(Case))

  const caseArchiveModel = caseModule.get<typeof CaseArchive>(
    getModelToken(CaseArchive),
  )

  const caseConfig = caseModule.get<ConfigType<typeof caseModuleConfig>>(
    caseModuleConfig.KEY,
  )

  const caseService = caseModule.get<CaseService>(CaseService)

  const limitedAccessCaseService = caseModule.get<LimitedAccessCaseService>(
    LimitedAccessCaseService,
  )

  const caseController = caseModule.get<CaseController>(CaseController)

  const internalCaseController = caseModule.get<InternalCaseController>(
    InternalCaseController,
  )

  const limitedAccessCaseController = caseModule.get<LimitedAccessCaseController>(
    LimitedAccessCaseController,
  )

  return {
    messageService,
    courtService,
    policeService,
    userService,
    fileService,
    awsS3Service,
    defendantService,
    logger,
    sequelize,
    caseModel,
    caseArchiveModel,
    caseConfig,
    caseService,
    limitedAccessCaseService,
    caseController,
    internalCaseController,
    limitedAccessCaseController,
  }
}
