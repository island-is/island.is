import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'

import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'

import { SharedTemplateApiService } from '../../../shared'
import { ExamplePaymentActionsService } from './examplePaymentActions.service'
import {
  AdapterService,
  EmailService,
  emailModuleConfig,
} from '@island.is/email-service'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@island.is/nest/config'
import { createApplication } from '@island.is/application/testing'

describe('ExamplePaymentActionsService', () => {
  let service: ExamplePaymentActionsService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailModuleConfig],
        }),
      ],
      providers: [
        ExamplePaymentActionsService,
        EmailService,
        AdapterService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: () => 'http://localhost',
          })),
        },
        {
          provide: SharedTemplateApiService,
          useClass: jest.fn(() => ({
            async createCharge() {
              return { paymentUrl: 'asdf', id: 'asdf' }
            },
            async getPaymentStatus() {
              return { fulfilled: true }
            },
            async sendEmail() {
              return 'messageId'
            },
          })),
        },
      ],
    }).compile()

    service = module.get(ExamplePaymentActionsService)
  })

  describe('submitApplication', () => {
    it('it should create a payment', async () => {
      const user = createCurrentUser()

      const application = createApplication({
        answers: {
          userSelectedChargeItemCode: 'AYAYAY01',
        },
        typeId: ApplicationTypes.EXAMPLE_PAYMENT,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.createCharge({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({
        paymentUrl: 'asdf',
        id: 'asdf',
      })
    })
  })
})
