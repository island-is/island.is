import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { IntlService } from '@island.is/cms-translations'
import { SigningService } from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { LoggingModule } from '@island.is/logging'

import { environment } from '../../../../environments'
import { CourtService } from '../../court'
import { EventService } from '../../event'
import { UserService } from '../../user'
import { FileService } from '../../file'
import { AwsS3Service } from '../../aws-s3'
import { Case } from '../models'
import { CaseService } from '../case.service'
import { CaseController } from '../case.controller'

jest.mock('@island.is/dokobit-signing')
jest.mock('@island.is/email-service')
jest.mock('@island.is/cms-translations')
jest.mock('../../court/court.service.ts')
jest.mock('../../event/event.service.ts')
jest.mock('../../user/user.service.ts')
jest.mock('../../file/file.service.ts')
jest.mock('../../aws-s3/awsS3.service.ts')

export const createTestingCaseModule = async () => {
  const caseModule = await Test.createTestingModule({
    imports: [
      LoggingModule,
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
      IntlService,
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

  const userService = await caseModule.resolve<UserService>(UserService)

  const caseModel = await caseModule.resolve<typeof Case>(getModelToken(Case))

  const caseService = caseModule.get<CaseService>(CaseService)

  const caseController = caseModule.get<CaseController>(CaseController)

  return { userService, caseModel, caseService, caseController }
}
