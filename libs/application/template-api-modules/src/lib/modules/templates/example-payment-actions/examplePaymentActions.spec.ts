import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import {
  AdapterService,
  EMAIL_OPTIONS,
  EmailService,
} from '@island.is/email-service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  createApplication,
  createCurrentUser,
} from '@island.is/testing/fixtures'

import { SharedTemplateApiService } from '../../shared'

import { ExamplePaymentActionsService } from './examplePaymentActions.service'

describe('ExamplePaymentActionsService', () => {
  let service: ExamplePaymentActionsService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExamplePaymentActionsService,
        EmailService,
        AdapterService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: EMAIL_OPTIONS,
          useValue: {
            useTestAccount: true,
            options: {
              region: 'region',
            },
          },
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
      })

      expect(res).toEqual({
        paymentUrl: 'asdf',
        id: 'asdf',
      })
    })
  })
})
