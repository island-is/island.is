import { Test } from '@nestjs/testing'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { DrivingLicenseApiConfig } from './drivingLicenseApi.config'
import { DrivingLicenseApi } from './drivingLicenseApi.service'
import { startMocking } from '@island.is/shared/mocking'
import { LoggingModule } from '@island.is/logging'
import { DrivingLicenseApiModule } from './drivingLicenseApi.module'
import { exportedApis } from './apiConfiguration'
import { CodeTableV5 } from '../v5'
import { ApplicationApiV6 } from '../v6'
import type { Auth } from '@island.is/auth-nest-tools'

import {
  lastNewCategoryRequest,
  lastV6TemporaryRequest,
  MOCK_TOKEN,
  requestHandlers,
} from './__mock-data__/requestHandlers'

startMocking(requestHandlers)
describe('DrivingLicenseDuplicateService', () => {
  let service: DrivingLicenseApi
  let codeTable: CodeTableV5
  let applicationV6: ApplicationApiV6

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        DrivingLicenseApiModule,
        LoggingModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, DrivingLicenseApiConfig],
        }),
      ],
      providers: [DrivingLicenseApi, ...exportedApis],
    }).compile()

    service = module.get(DrivingLicenseApi)
    codeTable = module.get(CodeTableV5)
    applicationV6 = module.get(ApplicationApiV6)
  })

  describe('Service', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('Photo And Signature', () => {
    it('GetHasQualityPhoto for a person with no photo', async () => {
      const response = await service.getHasQualityPhoto({
        token: MOCK_TOKEN.LICENSE_NO_PHOTO_NOR_SIGNATURE,
      })
      expect(response).toBe(false)
    })

    it('GetHasQualityPhoto for a person with photo', async () => {
      const response = await service.getHasQualityPhoto({
        token: MOCK_TOKEN.LICENSE_B_CATEGORY,
      })
      expect(response).toBe(true)
    })

    it('GetHasQualitySignature for a person with no signature', async () => {
      const response = await service.getHasQualitySignature({
        token: MOCK_TOKEN.LICENSE_NO_PHOTO_NOR_SIGNATURE,
      })
      expect(response).toBe(false)
    })

    it('GetHasQualitySignature for a person with signature', async () => {
      const response = await service.getHasQualitySignature({
        token: MOCK_TOKEN.LICENSE_B_CATEGORY,
      })
      expect(response).toBe(true)
    })
  })

  describe('postCreateDrivingLicenseFull biometric wire shape', () => {
    const baseParams = {
      nationalIdApplicant: '0101302479',
      willBringHealthCertificate: false,
      willBringQualityPhoto: true,
      jurisdictionId: 37,
      sendLicenseInMail: 0,
      sendLicenseToAddress: '',
      category: 'B',
    }

    beforeEach(() => {
      lastNewCategoryRequest.body = undefined
    })

    // The B-full redesign is flag-gated, and the safety argument for shipping it
    // is that with the flag off the RLS request is unchanged. That guarantee
    // lives here: the wrapper must pass `undefined` THROUGH so the keys are
    // omitted. Coercing to null (e.g. `params.photoBiometricsId ?? null`) would
    // silently add two keys to the live NewCategory request — this test is what
    // catches that.
    it('omits the biometric keys entirely when they are undefined (flag off)', async () => {
      await service.postCreateDrivingLicenseFull(baseParams)

      const body = lastNewCategoryRequest.body
      expect(body).toBeDefined()
      expect('photoBiometricsId' in (body as object)).toBe(false)
      expect('signatureBiometricsId' in (body as object)).toBe(false)
    })

    it('sends the biometric keys when the redesign resolved them (flag on)', async () => {
      await service.postCreateDrivingLicenseFull({
        ...baseParams,
        photoBiometricsId: 'facial-1',
        signatureBiometricsId: 'sig-1',
      })

      expect(lastNewCategoryRequest.body).toMatchObject({
        photoBiometricsId: 'facial-1',
        signatureBiometricsId: 'sig-1',
      })
    })

    // The RLS-quality-photo path deliberately sends explicit nulls; null and
    // absent are NOT interchangeable here, so pin that they survive as keys.
    it('preserves explicit nulls as present keys', async () => {
      await service.postCreateDrivingLicenseFull({
        ...baseParams,
        photoBiometricsId: null,
        signatureBiometricsId: null,
      })

      const body = lastNewCategoryRequest.body
      expect('photoBiometricsId' in (body as object)).toBe(true)
      expect(body?.photoBiometricsId).toBeNull()
      expect(body?.signatureBiometricsId).toBeNull()
    })
  })

  describe('postApplyForRenewal65', () => {
    it('returns true when the apply-for endpoint succeeds', async () => {
      const result = await service.postApplyForRenewal65({
        token: MOCK_TOKEN.STUDENT,
        districtId: 37,
        phoneNumber: '5551234',
        email: 'test@example.is',
        pickupPlasticAtDistrict: true,
        sendPlasticToPerson: false,
        contentList: [
          {
            fileName: 'cert.pdf',
            fileExtension: 'pdf',
            contentType: 'application/pdf',
            content: 'base64data',
            description: 'Laeknisvottord',
          },
        ],
        photoBiometricsId: null,
        signatureBiometricsId: null,
      })
      expect(result).toBe(true)
    })
  })

  describe('postTemporaryLicenseWithHealthDeclarationV6 error propagation', () => {
    // The v6 methods no longer swallow anything: on a 400 they propagate the
    // FetchError. The duplicate-on-retry policy (APPLICATION_ALREADY_EXISTS) now
    // lives in the submission service, which has the application and can tell a
    // lost-response retry from a fresh application. Here we only pin that errors
    // reach the caller intact (so toSubmissionError / the guard upstream can act).
    const auth = { authorization: 'Bearer some-token' } as Auth
    const model = {
      districtId: 37,
      instructorSSN: '0101302479',
      sendPlasticToPerson: false,
      healthDeclaration: {},
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    const rejectRawWith = (error: unknown) =>
      jest
        .spyOn(
          applicationV6,
          'apiApplicationsV6TemporarywithhealthdeclarationPostRaw',
        )
        .mockRejectedValue(error)

    it('propagates a 400 APPLICATION_ALREADY_EXISTS instead of swallowing it', async () => {
      const original = {
        status: 400,
        name: 'FetchError',
        body: { errorCode: 'APPLICATION_ALREADY_EXISTS' },
      }
      rejectRawWith(original)
      const canApply = jest.spyOn(service, 'getCanApplyForCategoryTemporary')

      await expect(
        service.postTemporaryLicenseWithHealthDeclarationV6({ auth, model }),
      ).rejects.toBe(original)
      // No canapplyfor round-trip: that v5-era check is gone from the v6 path.
      expect(canApply).not.toHaveBeenCalled()
    })

    it('propagates any other error too', async () => {
      const original = { status: 500, name: 'FetchError' }
      rejectRawWith(original)

      await expect(
        service.postTemporaryLicenseWithHealthDeclarationV6({ auth, model }),
      ).rejects.toBe(original)
    })
  })

  describe('v6 token forwarding (jwttoken header)', () => {
    // This is the one test that actually executes the fetch wrapper in
    // `apiConfiguration.ts`. Every other v6 test spies above the fetch layer, so
    // without this the PR's central claim — that we send the header RLS reads —
    // is unverified in CI and only confirmed by hand against IS-DEV.
    const auth = { authorization: 'Bearer v6-user-token' } as Auth

    beforeEach(() => {
      lastV6TemporaryRequest.headers = undefined
      lastV6TemporaryRequest.body = undefined
    })

    it('sends the bare token in jwttoken, keeping the X-Road headers intact', async () => {
      const response =
        await service.postTemporaryLicenseWithHealthDeclarationV6({
          auth,
          model: {
            districtId: 37,
            instructorSSN: '0101302479',
            sendPlasticToPerson: false,
            healthDeclaration: {},
          },
        })

      // The wrapper reads RLS's guid from the raw body (the DTO would drop it).
      expect(response).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890')

      const headers = lastV6TemporaryRequest.headers
      // Bare token: RLS answers 400 "Invalid JWT Token" to the prefixed form.
      expect(headers?.jwttoken).toBe('v6-user-token')
      // The wrapper rebuilds the Headers object, so pin that it carries the
      // config headers THROUGH rather than dropping them. Assert presence, not a
      // value: the values come from config (empty in CI, set locally), whereas
      // "not dropped by the rebuild" is what the wrapper is responsible for — a
      // dropped header would read back as null here.
      expect(headers?.secret).not.toBeNull()
      expect(headers?.['x-road-client']).not.toBeNull()
      // Both headers go out: `authSource: 'context'` also sets Authorization.
      // Documented here because the fallback, if RLS ever rejects the pair, is
      // to drop `authSource` and send jwttoken alone.
      expect(headers?.authorization).toBe('Bearer v6-user-token')
    })

    it('sends no jwttoken when there is no auth context to forward', async () => {
      // A missing context must not become the literal string 'undefined' in the
      // header, which is what a naive `String(auth?.authorization)` would do.
      await expect(
        service.postTemporaryLicenseWithHealthDeclarationV6({
          auth: {} as Auth,
          model: {
            districtId: 37,
            instructorSSN: '0101302479',
            sendPlasticToPerson: false,
            healthDeclaration: {},
          },
        }),
      ).resolves.toBeDefined()

      expect(lastV6TemporaryRequest.headers?.jwttoken).toBeNull()
    })
  })

  describe('postFullLicenseWithHealthDeclarationV6', () => {
    // Regression test for a false failure observed on IS-DEV: the 201 body was
    // routed through `handleCreateResponse` (written for v5 NewCategory), which
    // reported "unknown type of response" for an application RLS had actually
    // created. The applicant had already paid, was told it failed, and their retry
    // died with "An application already exists for this category".
    const auth = { authorization: 'Bearer v6-user-token' } as Auth
    const model = {
      districtId: 37,
      sendPlasticToPerson: false,
      healthDeclaration: {},
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    // The endpoint returns the new application's guid as the text body. Reaching
    // the return at all is success (4xx throws); the value is the extracted guid,
    // or null when the body carries none. None of these previously-misread shapes
    // must throw.
    it.each([
      [
        'a bare guid',
        '3630b0bc-ec51-442e-976d-13a3c21c5e5b',
        '3630b0bc-ec51-442e-976d-13a3c21c5e5b',
      ],
      [
        'a quoted guid',
        '"3630b0bc-ec51-442e-976d-13a3c21c5e5b"',
        '3630b0bc-ec51-442e-976d-13a3c21c5e5b',
      ],
      ['an id as text (no guid)', '3248752', null],
      ['an empty body', '', null],
      ['a wrapped zero', '{"value":0}', null],
      ['null', 'null', null],
    ])('resolves %s to %s', async (_label, body, expected) => {
      jest
        .spyOn(
          applicationV6,
          'apiApplicationsV6CategoryWithhealthdeclarationPost',
        )
        .mockResolvedValue(body as unknown as number)

      await expect(
        service.postFullLicenseWithHealthDeclarationV6({
          auth,
          category: 'B',
          model,
        }),
      ).resolves.toBe(expected)
    })

    it('propagates a 400 APPLICATION_ALREADY_EXISTS (duplicate handling is the submission service)', async () => {
      const problem = Object.assign(new Error('already exists'), {
        name: 'FetchError',
        status: 400,
        problem: {
          title: 'APPLICATION_ALREADY_EXISTS',
          detail: 'An application already exists for this category',
        },
      })
      jest
        .spyOn(
          applicationV6,
          'apiApplicationsV6CategoryWithhealthdeclarationPost',
        )
        .mockRejectedValue(problem)

      await expect(
        service.postFullLicenseWithHealthDeclarationV6({
          auth,
          category: 'B',
          model,
        }),
      ).rejects.toBe(problem)
    })

    it('propagates a rejection rather than reporting success', async () => {
      // 400 ProblemDetails is the documented failure mode and enhanced fetch
      // throws it, so it must reach submitApplication's error path intact.
      const problem = Object.assign(new Error('already exists'), {
        name: 'FetchError',
        status: 400,
      })
      jest
        .spyOn(
          applicationV6,
          'apiApplicationsV6CategoryWithhealthdeclarationPost',
        )
        .mockRejectedValue(problem)

      await expect(
        service.postFullLicenseWithHealthDeclarationV6({
          auth,
          category: 'B',
          model,
        }),
      ).rejects.toBe(problem)
    })
  })

  describe('getErrorCodeDescriptions caching', () => {
    const sampleCatalogue = [
      {
        code: 'HAS_POINTS',
        descriptionIs: 'Þú ert með punkta á ökuskírteini',
        descriptionEn: 'You have points on your license',
      },
    ]

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('fetches the catalogue once and memoises a non-empty result', async () => {
      const spy = jest
        .spyOn(codeTable, 'apiCodetablesErrorCodesGet')
        .mockResolvedValue(sampleCatalogue)

      const first = await service.getErrorCodeDescriptions()
      const second = await service.getErrorCodeDescriptions()

      expect(first).toEqual(sampleCatalogue)
      expect(second).toEqual(sampleCatalogue)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('does not memoise an empty body — retries on the next call', async () => {
      const spy = jest
        .spyOn(codeTable, 'apiCodetablesErrorCodesGet')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(sampleCatalogue)

      const first = await service.getErrorCodeDescriptions()
      const second = await service.getErrorCodeDescriptions()

      expect(first).toEqual([])
      expect(second).toEqual(sampleCatalogue)
      expect(spy).toHaveBeenCalledTimes(2)
    })

    it('does not memoise a failure — retries on the next call', async () => {
      const spy = jest
        .spyOn(codeTable, 'apiCodetablesErrorCodesGet')
        .mockRejectedValueOnce(new Error('codetable down'))
        .mockResolvedValueOnce(sampleCatalogue)

      await expect(service.getErrorCodeDescriptions()).rejects.toThrow(
        'codetable down',
      )
      const recovered = await service.getErrorCodeDescriptions()

      expect(recovered).toEqual(sampleCatalogue)
      expect(spy).toHaveBeenCalledTimes(2)
    })
  })
})
