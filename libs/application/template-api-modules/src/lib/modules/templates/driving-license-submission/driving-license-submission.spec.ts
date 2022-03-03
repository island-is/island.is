import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

import { DrivingLicenseService } from '@island.is/api/domains/driving-license'
import {
  Application,
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

import { DrivingLicenseSubmissionService } from './driving-license-submission.service'

describe('DrivingLicenseSubmissionService', () => {
  let drivingLicenseSubmissionService: DrivingLicenseSubmissionService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
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
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await drivingLicenseSubmissionService.submitApplication({
        application,
        auth: user,
      })

      expect(res).toEqual({
        success: true,
      })
    })
  })
})
