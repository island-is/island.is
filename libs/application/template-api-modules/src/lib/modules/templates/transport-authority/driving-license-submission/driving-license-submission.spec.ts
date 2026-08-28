import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'

import {
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
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
import {
  coreErrorMessages,
  getErrorReasonIfPresent,
} from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import type { ProviderErrorReason } from '@island.is/shared/problem'
import type { Locale } from '@island.is/shared/types'

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

      expect(res).toMatchObject({
        success: true,
      })
    })
  })

  describe('B-full-renewal-65 redesign branch', () => {
    let service: DrivingLicenseSubmissionService
    let applyForRenewal65: jest.Mock
    let renewDrivingLicense65AndOver: jest.Mock
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
      renewDrivingLicense65AndOver = jest.fn(async () => ({
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
            useValue: { applyForRenewal65, renewDrivingLicense65AndOver },
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

    it('routes to legacy renewDrivingLicense65AndOver when flag is off', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          is65RenewalRedesignEnabled: false,
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const result = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(result).toMatchObject({ success: true })
      expect(renewDrivingLicense65AndOver).toHaveBeenCalledTimes(1)
      expect(applyForRenewal65).not.toHaveBeenCalled()

      const [auth, input] = renewDrivingLicense65AndOver.mock.calls[0]
      expect(auth).toBe(user.authorization)
      expect(input).toMatchObject({
        jurisdiction: 37,
        sendPlasticToPerson: true,
        pickupPlasticAtDistrict: false,
      })
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
            summary: expect.objectContaining({
              id: 'dl.application:validation.healthCertificateRequired',
            }),
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

      expect(res).toMatchObject({ success: true })
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

      expect(res).toMatchObject({ success: true })
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

      expect(res).toMatchObject({ success: true })
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

      expect(res).toMatchObject({ success: true })
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

      expect(res).toMatchObject({ success: true })
      expect(applyForRenewal65).toHaveBeenCalledTimes(1)
    })
  })

  describe('B-temp redesign branch', () => {
    let service: DrivingLicenseSubmissionService
    let newTemporaryDrivingLicense: jest.Mock
    let postHealthDeclaration: jest.Mock
    let newTemporaryDrivingLicenseWithHealthDeclaration: jest.Mock
    let getFiles: jest.Mock

    const baseAnswers = {
      applicationFor: 'B-temp',
      email: 'mock@email.com',
      phone: '9999999',
      delivery: {
        deliveryMethod: 'post',
        jurisdiction: '37',
      },
    }

    const thjodskraExternalData = {
      allPhotosFromThjodskra: {
        data: {
          images: [
            { biometricId: 'facial-1', contentSpecification: 'FACIAL' },
            { biometricId: 'sig-1', contentSpecification: 'SIGNATURE' },
          ],
        },
        status: 'success' as const,
        date: new Date(),
      },
    }

    beforeEach(async () => {
      newTemporaryDrivingLicense = jest.fn(async () => ({
        success: true,
        errorMessage: null,
      }))
      postHealthDeclaration = jest.fn(async () => undefined)
      newTemporaryDrivingLicenseWithHealthDeclaration = jest.fn(async () => ({
        success: true,
        errorMessage: null,
        applicationGuid: '2e23bf24-d8bd-4353-9faf-3fc5ce04090d',
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
            // All three registered together: a `.not.toHaveBeenCalled()`
            // assertion on a mock the service never received would pass
            // vacuously.
            useValue: {
              newTemporaryDrivingLicense,
              postHealthDeclaration,
              newTemporaryDrivingLicenseWithHealthDeclaration,
            },
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

    it('passes no biometric IDs when the persisted flag is off, even if selectLicensePhoto is set', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: false,
          selectLicensePhoto: 'facial-1',
        },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toMatchObject({ success: true })
      expect(newTemporaryDrivingLicense).toHaveBeenCalledTimes(1)

      // Flag off → biometric IDs are omitted entirely (not sent as null),
      // keeping the RLS request byte-identical to the pre-redesign flow.
      const [, , input] = newTemporaryDrivingLicense.mock.calls[0]
      expect(input.photoBiometricsId).toBeUndefined()
      expect(input.signatureBiometricsId).toBeUndefined()
    })

    it('routes flag-on submissions to the v6 withhealthdeclaration endpoint, in a single call', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: true,
          selectLicensePhoto: 'facial-1',
          drivingInstructor: '0101302399',
        },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      // The RLS application guid is threaded into submitApplication's return, so
      // the framework persists it at externalData.submitApplication.data — the
      // durable handle for support/reconciliation, not just the api logs.
      expect(res).toStrictEqual({
        success: true,
        applicationGuid: '2e23bf24-d8bd-4353-9faf-3fc5ce04090d',
      })
      expect(
        newTemporaryDrivingLicenseWithHealthDeclaration,
      ).toHaveBeenCalledTimes(1)
      // The legacy pair must not run: the v6 endpoint does both jobs.
      expect(newTemporaryDrivingLicense).not.toHaveBeenCalled()
      expect(postHealthDeclaration).not.toHaveBeenCalled()

      const [auth, input] =
        newTemporaryDrivingLicenseWithHealthDeclaration.mock.calls[0]
      // The whole Auth object, not auth.authorization: the client needs it for
      // withAuthContext, and passing the string would leave the jwttoken header
      // unset while this test still passed.
      expect(auth).toBe(user)
      expect(input).toMatchObject({
        districtId: 37,
        instructorSSN: '0101302399',
        sendPlasticToPerson: true,
        email: 'mock@email.com',
        photoBiometricsId: 'facial-1',
        signatureBiometricsId: 'sig-1',
      })
      // No certificate needed → the key is omitted rather than sent as null.
      expect(input.contentList).toBeUndefined()
      expect(input.healthDeclaration.hasEpilepsy).toBe(false)
    })

    // The duplicate-on-retry cases. RLS returns 400 APPLICATION_ALREADY_EXISTS;
    // the api-domain method throws it (the v6 client no longer swallows). The
    // submission service tolerates it as success ONLY when THIS application
    // already has a submitApplication entry — a lost-response retry on the same
    // application — and preserves the guid the first run stored.
    const alreadyExists = Object.assign(new Error('already exists'), {
      name: 'FetchError',
      status: 400,
      body: { errorCode: 'APPLICATION_ALREADY_EXISTS' },
    })

    it('tolerates ALREADY_EXISTS as success on a lost-response retry (same application) and keeps the stored guid', async () => {
      newTemporaryDrivingLicenseWithHealthDeclaration.mockRejectedValueOnce(
        alreadyExists,
      )
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: true,
          selectLicensePhoto: 'facial-1',
          drivingInstructor: '0101302399',
        },
        externalData: {
          ...thjodskraExternalData,
          // The first (failed) run left a submitApplication entry — the marker
          // that this is a retry on the same application.
          submitApplication: {
            data: { applicationGuid: '2e23bf24-d8bd-4353-9faf-3fc5ce04090d' },
            status: 'success',
            date: new Date(),
          },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toStrictEqual({
        success: true,
        applicationGuid: '2e23bf24-d8bd-4353-9faf-3fc5ce04090d',
      })
    })

    it('does NOT swallow ALREADY_EXISTS for a fresh application (no prior submit entry) — surfaces the error', async () => {
      // The defect the manual dev test caught: a new application submitted while
      // another is active. Its payload was discarded by RLS, so the applicant
      // must see the error, not a false "received".
      newTemporaryDrivingLicenseWithHealthDeclaration.mockRejectedValueOnce(
        alreadyExists,
      )
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: true,
          selectLicensePhoto: 'facial-1',
          drivingInstructor: '0101302399',
        },
        // No submitApplication entry: this application never attempted submit.
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      await expect(
        service.submitApplication({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toBeDefined()
    })

    it('sends null biometric IDs when the RLS quality photo is selected', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: true,
          selectLicensePhoto: 'qualityPhoto',
        },
        externalData: {
          qualityPhotoAndSignature: {
            data: { pohto: 'somebase64' },
            status: 'success',
            date: new Date(),
          },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      const [, input] =
        newTemporaryDrivingLicenseWithHealthDeclaration.mock.calls[0]
      expect(input).toMatchObject({
        photoBiometricsId: null,
        signatureBiometricsId: null,
      })
    })

    it('attaches the certificate when a health answer requires one', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: true,
          selectLicensePhoto: 'facial-1',
          healthDeclaration: { hasEpilepsy: 'yes' },
        },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        { fileName: 'cert.pdf', fileContent: 'base64pdfdata' },
      ])

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      const [, input] =
        newTemporaryDrivingLicenseWithHealthDeclaration.mock.calls[0]
      expect(input.contentList).toHaveLength(1)
      expect(input.contentList[0]).toMatchObject({
        fileName: 'cert.pdf',
        contentType: 'application/pdf',
        description: 'Laeknisvottord',
      })
      expect(input.healthDeclaration.hasEpilepsy).toBe(true)
    })

    it('rejects when a certificate is required but none was uploaded', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: true,
          healthDeclaration: { hasEpilepsy: 'yes' },
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
            summary: expect.objectContaining({
              id: 'dl.application:validation.healthCertificateRequired',
            }),
          },
          status: 400,
        },
      })

      expect(
        newTemporaryDrivingLicenseWithHealthDeclaration,
      ).not.toHaveBeenCalled()
    })
  })

  describe('B-full redesign branch', () => {
    let service: DrivingLicenseSubmissionService
    let newDrivingLicense: jest.Mock
    let newDrivingLicenseWithHealthDeclaration: jest.Mock
    let getFiles: jest.Mock

    const baseAnswers = {
      applicationFor: 'B-full',
      email: 'mock@email.com',
      phone: '9999999',
      delivery: {
        deliveryMethod: 'post',
        jurisdiction: '37',
      },
    }

    const thjodskraExternalData = {
      allPhotosFromThjodskra: {
        data: {
          images: [
            { biometricId: 'facial-1', contentSpecification: 'FACIAL' },
            { biometricId: 'sig-1', contentSpecification: 'SIGNATURE' },
          ],
        },
        status: 'success' as const,
        date: new Date(),
      },
    }

    beforeEach(async () => {
      newDrivingLicense = jest.fn(async () => ({
        success: true,
        errorMessage: null,
      }))
      newDrivingLicenseWithHealthDeclaration = jest.fn(async () => ({
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
            // Both registered: a `.not.toHaveBeenCalled()` on a mock the
            // service never received would pass vacuously.
            useValue: {
              newDrivingLicense,
              newDrivingLicenseWithHealthDeclaration,
            },
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

    it('passes no biometric IDs when the persisted flag is off, even if selectLicensePhoto is set', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBFullRedesignEnabled: false,
          selectLicensePhoto: 'facial-1',
        },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toMatchObject({ success: true })
      expect(newDrivingLicense).toHaveBeenCalledTimes(1)

      // Flag off → biometric IDs are omitted entirely (not sent as null),
      // keeping the RLS request byte-identical to the pre-redesign flow.
      const [, input] = newDrivingLicense.mock.calls[0]
      expect(input.photoBiometricsId).toBeUndefined()
      expect(input.signatureBiometricsId).toBeUndefined()
    })

    it('routes flag-on submissions to the v6 withhealthdeclaration endpoint', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBFullRedesignEnabled: true,
          selectLicensePhoto: 'facial-1',
        },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toMatchObject({ success: true })
      expect(newDrivingLicenseWithHealthDeclaration).toHaveBeenCalledTimes(1)
      expect(newDrivingLicense).not.toHaveBeenCalled()

      const [auth, input] = newDrivingLicenseWithHealthDeclaration.mock.calls[0]
      // Whole Auth object, not auth.authorization - see the B-temp equivalent.
      expect(auth).toBe(user)
      expect(input).toMatchObject({
        licenseCategory: 'B',
        districtId: 37,
        sendPlasticToPerson: true,
        photoBiometricsId: 'facial-1',
        signatureBiometricsId: 'sig-1',
      })
      expect(input.contentList).toBeUndefined()
      // B-full previously sent only a derived boolean and dropped the ten
      // answers; they must now reach RLS.
      expect(input.healthDeclaration).toMatchObject({ hasEpilepsy: false })
    })

    // The v6 call takes the resolver's output through `resolved?.x`, so what the
    // resolver distinguishes — an explicit null for "selected, but no biometric
    // ID to send" versus nothing at all for "no selection" — has to survive to
    // the request. Unlike the legacy path, where the distinction was load-bearing
    // for keeping requests byte-identical, here it is consistency with the BE and
    // 65+ payloads; how RLS itself treats null vs absent on this endpoint has not
    // been verified.
    it.each([
      ['a stale selection matching no FACIAL entry', 'facial-gone'],
      ['the RLS quality photo', 'qualityPhoto'],
    ])('sends explicit null biometric IDs for %s', async (_label, selected) => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBFullRedesignEnabled: true,
          selectLicensePhoto: selected,
        },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      const [, input] = newDrivingLicenseWithHealthDeclaration.mock.calls[0]
      expect('photoBiometricsId' in input).toBe(true)
      expect(input.photoBiometricsId).toBeNull()
      expect(input.signatureBiometricsId).toBeNull()
    })

    it('omits the biometric keys when no photo was selected at all', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: { ...baseAnswers, isBFullRedesignEnabled: true },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      const [, input] = newDrivingLicenseWithHealthDeclaration.mock.calls[0]
      expect(input.photoBiometricsId).toBeUndefined()
      expect(input.signatureBiometricsId).toBeUndefined()
    })

    it('attaches the certificate when a health answer requires one', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBFullRedesignEnabled: true,
          selectLicensePhoto: 'facial-1',
          healthDeclaration: { hasDiabetes: 'yes' },
        },
        externalData: thjodskraExternalData,
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        { fileName: 'cert.pdf', fileContent: 'base64pdfdata' },
      ])

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      const [, input] = newDrivingLicenseWithHealthDeclaration.mock.calls[0]
      expect(input.contentList).toHaveLength(1)
      expect(input.healthDeclaration.hasDiabetes).toBe(true)
    })

    it('rejects when a certificate is required but none was uploaded', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBFullRedesignEnabled: true,
          healthDeclaration: { hasDiabetes: 'yes' },
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
            summary: expect.objectContaining({
              id: 'dl.application:validation.healthCertificateRequired',
            }),
          },
          status: 400,
        },
      })

      expect(newDrivingLicenseWithHealthDeclaration).not.toHaveBeenCalled()
    })
  })

  describe('BE branch', () => {
    let service: DrivingLicenseSubmissionService
    let applyForBELicense: jest.Mock
    let getFiles: jest.Mock

    const baseAnswers = {
      applicationFor: 'BE',
      email: 'mock@email.com',
      phone: '9999999',
    }

    beforeEach(async () => {
      getFiles = jest.fn(async () => [])
      applyForBELicense = jest.fn(async () => ({
        success: true,
        errorMessage: null,
      }))

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
            useValue: { applyForBELicense },
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

    it('forwards sendPlasticToPerson: true when the delivery method is post (home delivery)', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          delivery: { deliveryMethod: 'post', jurisdiction: '37' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toMatchObject({ success: true })
      expect(applyForBELicense).toHaveBeenCalledTimes(1)
      const [, , input] = applyForBELicense.mock.calls[0]
      expect(input).toMatchObject({
        jurisdiction: 37,
        sendPlasticToPerson: true,
      })
    })

    it('forwards sendPlasticToPerson: false when the delivery method is district (pickup)', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          delivery: { deliveryMethod: 'district', jurisdiction: '37' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(applyForBELicense).toHaveBeenCalledTimes(1)
      const [, , input] = applyForBELicense.mock.calls[0]
      expect(input.sendPlasticToPerson).toBe(false)
    })

    it('defaults sendPlasticToPerson to false (pickup) when no delivery method is set', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(applyForBELicense).toHaveBeenCalledTimes(1)
      const [, , input] = applyForBELicense.mock.calls[0]
      expect(input.sendPlasticToPerson).toBe(false)
    })

    // The cases below cover the shared health-certificate and health-declaration
    // helpers on BE, which is the only branch running them unflagged in
    // production. Before these existed, `baseAnswers` carried no
    // `healthDeclaration`, so `beNeedsHealthCert` was always false and every BE
    // test passed whether the builders worked or not.
    it('builds contentList from the uploaded certificate when a health answer is yes', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          healthDeclaration: { hasEpilepsy: 'yes' },
          delivery: { deliveryMethod: 'post', jurisdiction: '37' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        { fileName: 'cert.pdf', fileContent: 'base64pdfdata' },
      ])

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(applyForBELicense).toHaveBeenCalledTimes(1)
      const [, , input] = applyForBELicense.mock.calls[0]
      expect(input.contentList).toHaveLength(1)
      expect(input.contentList[0]).toMatchObject({
        fileName: 'cert.pdf',
        fileExtension: 'pdf',
        contentType: 'application/pdf',
        content: 'base64pdfdata',
        description: 'Laeknisvottord',
      })
    })

    it('normalises a jpg upload to the jpeg extension RLS expects', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          healthDeclaration: { hasDiabetes: 'yes' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        { fileName: 'cert.JPG', fileContent: 'base64jpgdata' },
      ])

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      const [, , input] = applyForBELicense.mock.calls[0]
      expect(input.contentList[0]).toMatchObject({
        fileExtension: 'jpeg',
        contentType: 'image/jpeg',
      })
    })

    it('rejects when a certificate is required but nothing was uploaded', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          healthDeclaration: { hasEpilepsy: 'yes' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      // getFiles returns [] by default — nothing attached
      await expect(
        service.submitApplication({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toMatchObject({
        problem: {
          errorReason: {
            summary: expect.objectContaining({
              id: 'dl.application:validation.healthCertificateRequired',
            }),
          },
          status: 400,
        },
      })

      expect(applyForBELicense).not.toHaveBeenCalled()
    })

    it('requires a certificate when the glasses check fires, even with all answers no', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          healthDeclaration: { hasEpilepsy: 'no', hasDiabetes: 'no' },
        },
        externalData: {
          glassesCheck: {
            data: true,
            status: 'success',
            date: new Date(),
          },
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
            summary: expect.objectContaining({
              id: 'dl.application:validation.healthCertificateRequired',
            }),
          },
          status: 400,
        },
      })
    })

    it('maps every health-declaration answer, defaulting unanswered questions to false', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          healthDeclaration: { hasEpilepsy: 'yes' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      getFiles.mockResolvedValueOnce([
        { fileName: 'cert.pdf', fileContent: 'base64pdfdata' },
      ])

      await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      const [, , input] = applyForBELicense.mock.calls[0]
      // Unanswered questions must be false, not omitted: RLS reads a missing key
      // as null rather than a negative answer.
      expect(input.healthDeclarationModel).toEqual({
        isDisabled: false,
        hasDiabetes: false,
        hasEpilepsy: true,
        isAlcoholic: false,
        hasHeartDisease: false,
        hasMentalIllness: false,
        hasOtherDiseases: false,
        usesMedicalDrugs: false,
        usesContactGlasses: false,
        hasReducedPeripheralVision: false,
      })
    })
  })

  // Exercised through the BE branch because BE runs the shared resolver
  // unflagged in production — the same helper serves 65+, B-full and B-temp.
  describe('resolveSelectedPhotoBiometrics', () => {
    let service: DrivingLicenseSubmissionService
    let applyForBELicense: jest.Mock
    let logSpy: jest.SpyInstance

    const baseAnswers = {
      applicationFor: 'BE',
      email: 'mock@email.com',
      phone: '9999999',
    }

    const submit = async (answers: FormValue, externalData: ExternalData) => {
      await service.submitApplication({
        application: createApplication({
          answers: { ...baseAnswers, ...answers },
          externalData,
          typeId: ApplicationTypes.DRIVING_LICENSE,
          status: ApplicationStatus.IN_PROGRESS,
        }),
        auth: createCurrentUser(),
        currentUserLocale: 'is',
      })
      const [, , input] = applyForBELicense.mock.calls[0]
      return input
    }

    const photoErrors = () =>
      logSpy.mock.calls.filter(
        ([lvl, message]) =>
          lvl === 'error' && String(message).includes('quality photo'),
      )

    beforeEach(async () => {
      applyForBELicense = jest.fn(async () => ({
        success: true,
        errorMessage: null,
      }))
      logSpy = jest.spyOn(logger, 'log')

      const module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, load: [emailModuleConfig] }),
        ],
        providers: [
          DrivingLicenseSubmissionService,
          EmailService,
          AdapterService,
          { provide: DrivingLicenseService, useValue: { applyForBELicense } },
          { provide: LOGGER_PROVIDER, useValue: logger },
          {
            provide: ConfigService,
            useClass: jest.fn(() => ({ get: () => 'http://localhost' })),
          },
          {
            provide: AttachmentS3Service,
            useValue: { getFiles: jest.fn(async () => []) },
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

    afterEach(() => logSpy.mockRestore())

    // A valid FACIAL with no paired SIGNATURE entry: the photo resolves, the
    // signature does not. Previously untested in any of the four branches.
    it('sends the photo ID with a null signature when no SIGNATURE entry exists', async () => {
      const input = await submit(
        { selectLicensePhoto: 'facial-1' },
        {
          allPhotosFromThjodskra: {
            data: {
              images: [
                { biometricId: 'facial-1', contentSpecification: 'FACIAL' },
              ],
            },
            status: 'success',
            date: new Date(),
          },
        },
      )

      expect(input.photoBiometricsId).toBe('facial-1')
      expect(input.signatureBiometricsId).toBeNull()
    })

    it('sends both IDs as null when the selection matches no FACIAL entry', async () => {
      const input = await submit(
        { selectLicensePhoto: 'facial-gone' },
        {
          allPhotosFromThjodskra: {
            data: {
              images: [
                { biometricId: 'facial-1', contentSpecification: 'FACIAL' },
              ],
            },
            status: 'success',
            date: new Date(),
          },
        },
      )

      expect(input.photoBiometricsId).toBeNull()
      expect(input.signatureBiometricsId).toBeNull()
    })

    // Legacy RLS records carry a valid imageId with no binary. The picker
    // offers them, so selecting one is correct and must not log an error.
    it('does not log an error for a legacy RLS record with imageId but no binary', async () => {
      const input = await submit(
        { selectLicensePhoto: 'qualityPhoto' },
        {
          qualityPhotoAndSignature: {
            data: { imageId: 7, pohto: null },
            status: 'success',
            date: new Date(),
          },
        },
      )

      expect(input.photoBiometricsId).toBeNull()
      expect(photoErrors()).toHaveLength(0)
    })

    it('still logs an error when no quality photo record exists at all', async () => {
      await submit({ selectLicensePhoto: 'qualityPhoto' }, {})

      expect(photoErrors()).toHaveLength(1)
    })
  })

  describe('submitApplication — RLS error-code messages', () => {
    let service: DrivingLicenseSubmissionService
    let newDrivingLicense: jest.Mock
    let describeErrorCode: jest.Mock

    // A FetchError as the submission catch recognises it: name === 'FetchError'
    // with RLS's `problem` (code in `title`) and an http `status`.
    const makeFetchError = (
      problem: { title?: string; detail?: string },
      status = 400,
    ) => {
      const err = new Error('rls submission failed') as Error & {
        problem?: unknown
        status?: number
      }
      err.name = 'FetchError'
      err.problem = problem
      err.status = status
      return err
    }

    // The temporary endpoint's 400 shape: plain JSON, code in `body.errorCode`
    // (no problem+json), which toSubmissionError must also localise.
    const makeFetchErrorBody = (errorCode: string, status = 400) => {
      const err = new Error('rls submission failed') as Error & {
        body?: unknown
        status?: number
      }
      err.name = 'FetchError'
      err.body = { errorCode }
      err.status = status
      return err
    }

    // No applicationFor → defaults to B-full → newDrivingLicense is the create call.
    const buildApplication = () =>
      createApplication({
        answers: { email: 'mock@email.com', phone: '9999999' },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

    beforeEach(async () => {
      newDrivingLicense = jest.fn()
      describeErrorCode = jest.fn()

      const module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, load: [emailModuleConfig] }),
        ],
        providers: [
          DrivingLicenseSubmissionService,
          EmailService,
          AdapterService,
          {
            provide: DrivingLicenseService,
            useValue: { newDrivingLicense, describeErrorCode },
          },
          { provide: LOGGER_PROVIDER, useValue: logger },
          {
            provide: ConfigService,
            useClass: jest.fn(() => ({ get: () => 'http://localhost' })),
          },
          {
            provide: AttachmentS3Service,
            useValue: { getFiles: jest.fn(async () => []) },
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

    const reasonOf = (thrown: TemplateApiError) =>
      (thrown.problem as unknown as { errorReason: ProviderErrorReason })
        .errorReason

    // Capture the rejected TemplateApiError so we can run its reason through the
    // same helper the payment screen uses to decide what to render.
    const submitAndCatch = (locale: Locale): Promise<TemplateApiError> =>
      service
        .submitApplication({
          application: buildApplication(),
          auth: createCurrentUser(),
          currentUserLocale: locale,
        })
        .then(
          () =>
            Promise.reject(new Error('expected submitApplication to reject')),
          (e: TemplateApiError) => e,
        )

    it('renders the Icelandic RLS description on the payment screen, even with no problem.detail', async () => {
      // No `detail` is exactly the shape that used to be dropped to generic copy.
      newDrivingLicense.mockRejectedValue(
        makeFetchError({ title: 'HAS_POINTS' }),
      )
      describeErrorCode.mockResolvedValue({
        is: 'Einstaklingur hefur punkta á skírteini',
        en: 'Person has points on their license',
      })

      const thrown = await submitAndCatch('is')

      expect(describeErrorCode).toHaveBeenCalledWith('HAS_POINTS')
      // getErrorReasonIfPresent keeps a reason only when title AND summary are
      // non-empty; our text rides in `summary`, so the screen shows it instead
      // of the generic fallback.
      expect(getErrorReasonIfPresent(reasonOf(thrown)).summary).toBe(
        'Einstaklingur hefur punkta á skírteini',
      )
    })

    it('renders the English RLS description for an en user', async () => {
      newDrivingLicense.mockRejectedValue(
        makeFetchError({ title: 'HAS_POINTS' }),
      )
      describeErrorCode.mockResolvedValue({
        is: 'Einstaklingur hefur punkta á skírteini',
        en: 'Person has points on their license',
      })

      const thrown = await submitAndCatch('en')

      expect(getErrorReasonIfPresent(reasonOf(thrown)).summary).toBe(
        'Person has points on their license',
      )
    })

    it('localises the code from body.errorCode (temporary endpoint plain-JSON 400)', async () => {
      newDrivingLicense.mockRejectedValue(
        makeFetchErrorBody('APPLICATION_ALREADY_EXISTS'),
      )
      describeErrorCode.mockResolvedValue({
        is: 'Umsókn er þegar til',
        en: 'An application already exists',
      })

      const thrown = await submitAndCatch('is')

      expect(describeErrorCode).toHaveBeenCalledWith(
        'APPLICATION_ALREADY_EXISTS',
      )
      expect(getErrorReasonIfPresent(reasonOf(thrown)).summary).toBe(
        'Umsókn er þegar til',
      )
    })

    it('uses the generic title (never the raw code) when the code is not in the table', async () => {
      newDrivingLicense.mockRejectedValue(
        makeFetchError({ title: 'SOME_UNMAPPED_CODE', detail: 'raw detail' }),
      )
      describeErrorCode.mockResolvedValue(null)

      const thrown = await submitAndCatch('is')

      // The raw RLS code must never reach the UI — generic title, detail as body.
      expect(reasonOf(thrown)).toMatchObject({
        title: coreErrorMessages.failedDataProviderSubmit,
        summary: 'raw detail',
      })
      expect(reasonOf(thrown).title).not.toBe('SOME_UNMAPPED_CODE')
      expect(thrown.problem.status).toBe(400)
    })

    it('falls back to the generic title (best-effort) when the codetable lookup itself throws', async () => {
      newDrivingLicense.mockRejectedValue(
        makeFetchError({ title: 'HAS_POINTS', detail: 'raw detail' }),
      )
      describeErrorCode.mockRejectedValue(new Error('codetable down'))

      const thrown = await submitAndCatch('is')

      expect(reasonOf(thrown)).toMatchObject({
        title: coreErrorMessages.failedDataProviderSubmit,
        summary: 'raw detail',
      })
      expect(reasonOf(thrown).title).not.toBe('HAS_POINTS')
    })

    it('does not look up a description when the error carries no code', async () => {
      newDrivingLicense.mockRejectedValue(
        makeFetchError({ detail: 'raw detail' }),
      )

      const thrown = await submitAndCatch('is')

      expect(describeErrorCode).not.toHaveBeenCalled()
      // No code → generic title with the raw detail as summary (unchanged).
      expect(reasonOf(thrown)).toMatchObject({
        title: coreErrorMessages.failedDataProviderSubmit,
        summary: 'raw detail',
      })
    })

    it('simulates a submission failure from fakeData.submitErrorCode without calling RLS', async () => {
      describeErrorCode.mockResolvedValue({
        is: 'Einstaklingur hefur punkta á skírteini',
        en: 'Person has points on their license',
      })

      const application = createApplication({
        answers: {
          email: 'mock@email.com',
          phone: '9999999',
          fakeData: { useFakeData: 'yes', submitErrorCode: 'HAS_POINTS' },
        },
        typeId: ApplicationTypes.DRIVING_LICENSE,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const thrown = await service
        .submitApplication({
          application,
          auth: createCurrentUser(),
          currentUserLocale: 'is',
        })
        .then(
          () =>
            Promise.reject(new Error('expected submitApplication to reject')),
          (e: TemplateApiError) => e,
        )

      // The fake path short-circuits before any real RLS create call...
      expect(newDrivingLicense).not.toHaveBeenCalled()
      // ...but still resolves + renders the chosen code's message.
      expect(describeErrorCode).toHaveBeenCalledWith('HAS_POINTS')
      expect(getErrorReasonIfPresent(reasonOf(thrown)).summary).toBe(
        'Einstaklingur hefur punkta á skírteini',
      )
    })
  })
})
