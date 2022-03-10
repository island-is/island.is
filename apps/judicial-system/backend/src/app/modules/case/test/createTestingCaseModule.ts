import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { IntlService } from '@island.is/cms-translations'
import { SigningService } from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CourtService } from '../../court'
import { EventService } from '../../event'
import { UserService } from '../../user'
import { FileService } from '../../file'
import { AwsS3Service } from '../../aws-s3'
import { DefendantService } from '../../defendant'
import { Case } from '../models/case.model'
import { CaseService } from '../case.service'
import { CaseController } from '../case.controller'

jest.mock('@island.is/dokobit-signing')
jest.mock('@island.is/email-service')
jest.mock('../../court/court.service')
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
    ],
    controllers: [CaseController],
    providers: [
      CourtService,
      UserService,
      FileService,
      AwsS3Service,
      EventService,
      SigningService,
      EmailService,
      DefendantService,
      {
        provide: IntlService,
        useValue: {
          useIntl: async () => ({}),
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
      CaseService,
    ],
  }).compile()

  const courtService = caseModule.get<CourtService>(CourtService)

  const userService = caseModule.get<UserService>(UserService)

  const awsS3Service = caseModule.get<AwsS3Service>(AwsS3Service)

  const defendantService = caseModule.get<DefendantService>(DefendantService)

  const logger = caseModule.get<Logger>(LOGGER_PROVIDER)

  const sequelize = caseModule.get<Sequelize>(Sequelize)

  const caseModel = caseModule.get<typeof Case>(getModelToken(Case))

  const caseService = caseModule.get<CaseService>(CaseService)

  const caseController = caseModule.get<CaseController>(CaseController)

  return {
    courtService,
    userService,
    awsS3Service,
    defendantService,
    logger,
    sequelize,
    caseModel,
    caseService,
    caseController,
  }
}
