import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { SharedTemplateApiService } from '../../shared'
import { CriminalRecordSubmissionService } from './criminal-record-submission.service'
import { AdapterService } from '@island.is/email-service'
import {
  SyslumennService,
  SyslumennClientModule,
} from '@island.is/clients/syslumenn'
import { ConfigService } from '@nestjs/config'
import {
  defineConfig,
  ConfigModule,
  IdsClientConfig,
} from '@island.is/nest/config'
import { createApplication } from '@island.is/application/testing'

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
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config, IdsClientConfig],
        }),
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
