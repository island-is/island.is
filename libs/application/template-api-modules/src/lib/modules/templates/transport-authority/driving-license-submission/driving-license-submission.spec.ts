import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'

import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'

import { SharedTemplateApiService } from '../../../shared'
import { DrivingLicenseSubmissionService } from './driving-license-submission.service'
import {
  AdapterService,
  EmailService,
  emailModuleConfig,
} from '@island.is/email-service'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@island.is/nest/config'
import { createApplication } from '@island.is/application/testing'

describe('DrivingLicenseSubmissionService', () => {
  let drivingLicenseSubmissionService: DrivingLicenseSubmissionService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailModuleConfig],
        }),
      ],
      providers: [
        DrivingLicenseSubmissionService,
        EmailService,
        AdapterService,
        {
          provide: DrivingLicenseService,
          useClass: jest.fn(() => ({
            async newDrivingLicense() {
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

    drivingLicenseSubmissionService = module.get(
      DrivingLicenseSubmissionService,
    )
  })

  describe('submitApplication', () => {
    it('it should send an email', async () => {
      const user = createCurrentUser()

      const application = createApplication({
        answers: {
          certificate: 'yes',
          willBringQualityPhoto: 'yes',
          picture: 'yes',
          email: 'mock@email.com',
          phone: '9999999',
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await drivingLicenseSubmissionService.submitApplication({
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
