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

      expect(res).toEqual({
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

      expect(result).toEqual({ success: true })
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

  describe('B-temp redesign branch', () => {
    let service: DrivingLicenseSubmissionService
    let newTemporaryDrivingLicense: jest.Mock
    let postHealthDeclaration: jest.Mock

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
            useValue: { newTemporaryDrivingLicense, postHealthDeclaration },
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

      expect(res).toEqual({ success: true })
      expect(newTemporaryDrivingLicense).toHaveBeenCalledTimes(1)

      // Flag off → biometric IDs are omitted entirely (not sent as null),
      // keeping the RLS request byte-identical to the pre-redesign flow.
      const [, , input] = newTemporaryDrivingLicense.mock.calls[0]
      expect(input.photoBiometricsId).toBeUndefined()
      expect(input.signatureBiometricsId).toBeUndefined()
    })

    it('resolves photo and signature biometric IDs when a Thjodskra photo is selected', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          ...baseAnswers,
          isBTempRedesignEnabled: true,
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

      expect(res).toEqual({ success: true })
      const [, , input] = newTemporaryDrivingLicense.mock.calls[0]
      expect(input).toMatchObject({
        photoBiometricsId: 'facial-1',
        signatureBiometricsId: 'sig-1',
      })
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

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({ success: true })
      const [, , input] = newTemporaryDrivingLicense.mock.calls[0]
      expect(input).toMatchObject({
        photoBiometricsId: null,
        signatureBiometricsId: null,
      })
      expect(postHealthDeclaration).not.toHaveBeenCalled()
    })

    it('carries biometric IDs on both postHealthDeclaration and newTemporaryDrivingLicense when a health certificate is needed', async () => {
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

      const res = await service.submitApplication({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(res).toEqual({ success: true })

      expect(postHealthDeclaration).toHaveBeenCalledTimes(1)
      const [, healthModel] = postHealthDeclaration.mock.calls[0]
      expect(healthModel).toMatchObject({
        photoBiometricsId: 'facial-1',
        signatureBiometricsId: 'sig-1',
      })

      expect(newTemporaryDrivingLicense).toHaveBeenCalledTimes(1)
      const [, , input] = newTemporaryDrivingLicense.mock.calls[0]
      expect(input).toMatchObject({
        photoBiometricsId: 'facial-1',
        signatureBiometricsId: 'sig-1',
      })
    })
  })

  describe('BE branch', () => {
    let service: DrivingLicenseSubmissionService
    let applyForBELicense: jest.Mock

    const baseAnswers = {
      applicationFor: 'BE',
      email: 'mock@email.com',
      phone: '9999999',
    }

    beforeEach(async () => {
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

      expect(res).toEqual({ success: true })
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

    it('falls back to the raw title/detail behaviour when the code is not in the table', async () => {
      newDrivingLicense.mockRejectedValue(
        makeFetchError({ title: 'SOME_UNMAPPED_CODE', detail: 'raw detail' }),
      )
      describeErrorCode.mockResolvedValue(null)

      const thrown = await submitAndCatch('is')

      expect(reasonOf(thrown)).toMatchObject({
        title: 'SOME_UNMAPPED_CODE',
        summary: 'raw detail',
      })
      expect(thrown.problem.status).toBe(400)
    })

    it('falls back (best-effort) when the codetable lookup itself throws', async () => {
      newDrivingLicense.mockRejectedValue(
        makeFetchError({ title: 'HAS_POINTS', detail: 'raw detail' }),
      )
      describeErrorCode.mockRejectedValue(new Error('codetable down'))

      const thrown = await submitAndCatch('is')

      expect(reasonOf(thrown)).toMatchObject({
        title: 'HAS_POINTS',
        summary: 'raw detail',
      })
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
