import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  createCurrentUser,
  createApplication,
} from '@island.is/testing/fixtures'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { SharedTemplateApiService } from '../../shared'
import { CriminalRecordSubmissionService } from './criminal-record-submission.service'
import {
  AdapterService,
  EmailService,
  EMAIL_OPTIONS,
} from '@island.is/email-service'
import {
  SyslumennService,
  SyslumennClientModule,
} from '@island.is/clients/syslumenn'
import { CriminalRecordService } from '@island.is/api/domains/criminal-record'
import { ConfigService } from '@nestjs/config'
import { defineConfig, ConfigModule } from '@island.is/nest/config'

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

describe('CriminalRecordSubmissionService', () => {
  let criminalRecordSubmissionService: CriminalRecordSubmissionService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        SyslumennClientModule,
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
      ],
      providers: [
        CriminalRecordSubmissionService,
        SyslumennService,
        EmailService,
        AdapterService,
        {
          provide: CriminalRecordService,
          useClass: jest.fn(() => ({
            async newCriminalRecord() {
              return { success: true }
            },
          })),
        },
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

    criminalRecordSubmissionService = module.get(
      CriminalRecordSubmissionService,
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
        typeId: ApplicationTypes.CRIMINAL_RECORD,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await criminalRecordSubmissionService.submitApplication({
        application,
        auth: user,
      })

      expect(res).toEqual({
        success: true,
      })
    })
  })
})
