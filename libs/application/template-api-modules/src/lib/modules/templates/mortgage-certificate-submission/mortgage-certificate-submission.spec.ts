import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

import { MortgageCertificateService } from '@island.is/api/domains/mortgage-certificate'
import { createApplication } from '@island.is/application/testing'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import {
  SyslumennApiProvider,
  SyslumennClientModule,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import {
  AdapterService,
  emailModuleConfig,
  EmailService,
} from '@island.is/email-service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule, defineConfig } from '@island.is/nest/config'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { SharedTemplateApiService } from '../../shared'
import { MortgageCertificateSubmissionService } from './mortgage-certificate-submission.service'

const config = defineConfig({
  name: 'SyslumennApi',
  load: () => ({
    url: 'http://localhost',
    fetch: {
      timeout: '5000',
    },
    username: '',
    password: '',
  }),
})

describe('MortgageCertificateSubmissionService', () => {
  let mortgageCertificateSubmissionService: MortgageCertificateSubmissionService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        SyslumennClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config, emailModuleConfig],
        }),
      ],
      providers: [
        MortgageCertificateSubmissionService,
        SyslumennService,
        SyslumennApiProvider,
        EmailService,
        AdapterService,
        {
          provide: MortgageCertificateService,
          useClass: jest.fn(() => ({
            async newMortgageCertificate() {
              return { success: true }
            },
          })),
        },
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

    mortgageCertificateSubmissionService = module.get(
      MortgageCertificateSubmissionService,
    )
  })

  describe('submitApplication', () => {
    it('should send an email', async () => {
      const user = createCurrentUser()

      const application = createApplication({
        externalData: {
          createCharge: {
            data: {
              paymentUrl: 'someurl',
            },
            date: new Date(),
            status: 'success',
          },
        },
        typeId: ApplicationTypes.MORTGAGE_CERTIFICATE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await mortgageCertificateSubmissionService.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({
        success: true,
      })
    })
  })
})
