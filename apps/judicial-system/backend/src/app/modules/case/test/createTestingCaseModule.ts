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
import { Case } from '../models'
import { CaseService } from '../case.service'
import { CaseController } from '../case.controller'

export async function createTestingCaseModule(): Promise<CaseController> {
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
      {
        provide: CourtService,
        useClass: jest.fn(() => ({})),
      },
      {
        provide: UserService,
        useClass: jest.fn(() => ({})),
      },
      {
        provide: EventService,
        useClass: jest.fn(() => ({})),
      },
      {
        provide: SigningService,
        useClass: jest.fn(() => ({})),
      },
      {
        provide: EmailService,
        useClass: jest.fn(() => ({})),
      },
      {
        provide: IntlService,
        useClass: jest.fn(() => ({})),
      },
      {
        provide: getModelToken(Case),
        useValue: jest.fn(() => ({})),
      },
      CaseService,
    ],
  }).compile()

  return caseModule.get<CaseController>(CaseController)
}
