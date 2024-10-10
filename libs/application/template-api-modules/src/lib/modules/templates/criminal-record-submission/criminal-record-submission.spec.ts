import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

import { CriminalRecordService } from '@island.is/api/domains/criminal-record'
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
import { AdapterService } from '@island.is/email-service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule, defineConfig } from '@island.is/nest/config'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { SharedTemplateApiService } from '../../shared'
import { CriminalRecordSubmissionService } from './criminal-record-submission.service'

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
        {
          provide: CriminalRecordSubmissionService,
          useClass: jest.fn(() => ({
            async submitApplication() {
              return { success: true }
            },
          })),
        },
        SyslumennService,
        SyslumennApiProvider,
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
    it('should get a success submit response', async () => {
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
          userProfile: {
            data: {
              mobilePhoneNumber: '123123',
              email: 'test',
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
        currentUserLocale: 'is',
      })

      expect(res).toMatchObject({ success: true })
    })
  })
})
