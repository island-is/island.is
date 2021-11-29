import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  createCurrentUser,
  createApplication,
} from '@island.is/testing/fixtures'

import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'

import { SharedTemplateApiService } from '../../shared'
import { PMarkSubmissionService } from './p-mark-submission.service'
import {
  AdapterService,
  EmailService,
  EMAIL_OPTIONS,
} from '@island.is/email-service'
import { PMarkService } from '@island.is/api/domains/p-mark'
import { ConfigService } from '@nestjs/config'

describe('PMarkSubmissionService', () => {
  let pMarkSubmissionService: PMarkSubmissionService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PMarkSubmissionService,
        EmailService,
        AdapterService,
        {
          provide: PMarkService,
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

    pMarkSubmissionService = module.get(PMarkSubmissionService)
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

      const res = await pMarkSubmissionService.submitApplication({
        application,
        auth: user,
      })

      expect(res).toEqual({
        success: true,
      })
    })
  })
})
