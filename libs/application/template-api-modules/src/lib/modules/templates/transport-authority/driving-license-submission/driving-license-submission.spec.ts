import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'

import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'

import { SharedTemplateApiService } from '../../../shared'
import { AttachmentS3Service } from '../../../shared/services'
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
          provide: AttachmentS3Service,
          useClass: jest.fn(() => ({
            async getFiles() {
              return []
            },
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

  describe('B-full-renewal-65 redesign branch', () => {
    let service: DrivingLicenseSubmissionService
    let applyForRenewal65: jest.Mock
    let getFiles: jest.Mock

    const baseAnswers = {
      applicationFor: 'B-full-renewal-65',
      certificate: 'yes',
      email: 'mock@email.com',
      phone: '9999999',
      delivery: {
        deliveryMethod: 'post',
        jurisdiction: '37',
      },
    }

    beforeEach(async () => {
      applyForRenewal65 = jest.fn(async () => ({
        success: true,
        errorMessage: null,
      }))
      getFiles = jest.fn(async () => [])

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
            useValue: { applyForRenewal65 },
          },
          { provide: LOGGER_PROVIDER, useValue: logger },
          {
            provide: ConfigService,
            useClass: jest.fn(() => ({ get: () => 'http://localhost' })),
          },
          {
            provide: AttachmentS3Service,
            useValue: { getFiles },
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

      service = module.get(DrivingLicenseSubmissionService)
    })

    it('throws forced-restart error when flag is off (legacy / pre-flag-flip drafts)', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: false,
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      await expect(
        service.submitApplication({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toMatchObject({
        problem: {
          errorReason: {
            summary: expect.stringContaining(
              'Umsóknin þín var byrjuð áður en kerfið uppfærðist',
            ),
          },
          status: 400,
        },
      })

      expect(applyForRenewal65).not.toHaveBeenCalled()
    })

    it('throws missing-cert error when flag is on but no health certificate is uploaded', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: true,
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      // getFiles returns [] (no cert)
      await expect(
        service.submitApplication({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toMatchObject({
        problem: {
          errorReason: {
            summary: expect.stringContaining('Health certificate is required'),
          },
          status: 400,
        },
      })

      expect(applyForRenewal65).not.toHaveBeenCalled()
    })

    it('calls applyForRenewal65 with the BE-shaped payload when flag is on and cert is uploaded', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: true,
          selectLicensePhoto: 'qualityPhoto',
        },
        externalData: {
          qualityPhotoAndSignature: {
            data: { pohto: 'somebase64', imageTypeId: 1 },
            status: 'success',
            date: new Date(),
          },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        {
          fileName: 'cert.pdf',
          fileContent: 'base64pdfdata',
        },
      ])

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({ success: true })
      expect(applyForRenewal65).toHaveBeenCalledTimes(1)

      const [auth, input] = applyForRenewal65.mock.calls[0]
      expect(auth).toBe(user.authorization)
      expect(input).toMatchObject({
        jurisdiction: 37,
        primaryPhoneNumber: expect.any(String),
        studentEmail: 'mock@email.com',
        sendPlasticToPerson: true,
        pickupPlasticAtDistrict: false,
        photoBiometricsId: null,
        signatureBiometricsId: null,
      })
      expect(input.contentList).toHaveLength(1)
      expect(input.contentList[0]).toMatchObject({
        fileName: 'cert.pdf',
        contentType: 'application/pdf',
        description: 'Laeknisvottord',
      })
    })

    it('short-circuits with fake success when fakeData.useFakeData=yes and submitToRLS unset (default)', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: true,
          fakeData: { useFakeData: 'yes' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({ success: true })
      expect(applyForRenewal65).not.toHaveBeenCalled()
    })

    it('short-circuits with fake success when fakeData.useFakeData=yes and submitToRLS=no (explicit default)', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: true,
          fakeData: { useFakeData: 'yes', submitToRLS: 'no' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({ success: true })
      expect(applyForRenewal65).not.toHaveBeenCalled()
    })

    it('bypasses short-circuit and calls applyForRenewal65 when fakeData.useFakeData=yes and submitToRLS=yes', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: true,
          selectLicensePhoto: 'qualityPhoto',
          fakeData: { useFakeData: 'yes', submitToRLS: 'yes' },
        },
        externalData: {
          qualityPhotoAndSignature: {
            data: { pohto: 'somebase64', imageTypeId: 1 },
            status: 'success',
            date: new Date(),
          },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        { fileName: 'cert.pdf', fileContent: 'base64pdfdata' },
      ])

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({ success: true })
      expect(applyForRenewal65).toHaveBeenCalledTimes(1)
    })

    it('runs the normal RLS path when fakeData.useFakeData=no even with submitToRLS=yes set', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: true,
          selectLicensePhoto: 'qualityPhoto',
          fakeData: { useFakeData: 'no', submitToRLS: 'yes' },
        },
        externalData: {
          qualityPhotoAndSignature: {
            data: { pohto: 'somebase64', imageTypeId: 1 },
            status: 'success',
            date: new Date(),
          },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        { fileName: 'cert.pdf', fileContent: 'base64pdfdata' },
      ])

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({ success: true })
      expect(applyForRenewal65).toHaveBeenCalledTimes(1)
    })
  })
})
