import { Auth } from '@island.is/auth-nest-tools'
import { Test } from '@nestjs/testing'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { DrivingLicenseApiConfig } from './drivingLicenseApi.config'
import { DrivingLicenseApi } from './drivingLicenseApi.service'
import { startMocking } from '@island.is/shared/mocking'
import { LoggingModule } from '@island.is/logging'
import { DrivingLicenseApiModule } from './drivingLicenseApi.module'
import { exportedApis } from './apiConfiguration'
import { CodeTableV6, ImageApiV6 } from '../v6'

import {
  lastNewCategoryRequest,
  MOCK_TOKEN,
  requestHandlers,
} from './__mock-data__/requestHandlers'

const mockAuth = (authorization: string): Auth => ({
  authorization,
  client: 'test-client',
  scope: [],
})

startMocking(requestHandlers)
describe('DrivingLicenseDuplicateService', () => {
  let service: DrivingLicenseApi
  let codeTable: CodeTableV6
  let imageApi: ImageApiV6

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
    codeTable = module.get(CodeTableV6)
    imageApi = module.get(ImageApiV6)
  })

  describe('Service', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('Photo And Signature', () => {
    // v6 sends no per-person token on the request (identity comes from the
    // forwarded X-Road token), so these scenarios spy on the v6 ImageApi
    // directly rather than routing by a jwttoken header.
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('GetHasQualityPhoto for a person with no photo', async () => {
      jest
        .spyOn(imageApi, 'apiImagecontrollerV6HasqualityphotoGet')
        .mockResolvedValue(0)
      const response = await service.getHasQualityPhoto({
        auth: mockAuth(MOCK_TOKEN.LICENSE_NO_PHOTO_NOR_SIGNATURE),
      })
      expect(response).toBe(false)
    })

    it('GetHasQualityPhoto for a person with photo', async () => {
      jest
        .spyOn(imageApi, 'apiImagecontrollerV6HasqualityphotoGet')
        .mockResolvedValue(1)
      const response = await service.getHasQualityPhoto({
        auth: mockAuth(MOCK_TOKEN.LICENSE_B_CATEGORY),
      })
      expect(response).toBe(true)
    })

    it('GetHasQualitySignature for a person with no signature', async () => {
      jest
        .spyOn(imageApi, 'apiImagecontrollerV6HasqualitysignatureGet')
        .mockResolvedValue(0)
      const response = await service.getHasQualitySignature({
        auth: mockAuth(MOCK_TOKEN.LICENSE_NO_PHOTO_NOR_SIGNATURE),
      })
      expect(response).toBe(false)
    })

    it('GetHasQualitySignature for a person with signature', async () => {
      jest
        .spyOn(imageApi, 'apiImagecontrollerV6HasqualitysignatureGet')
        .mockResolvedValue(1)
      const response = await service.getHasQualitySignature({
        auth: mockAuth(MOCK_TOKEN.LICENSE_B_CATEGORY),
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
        auth: mockAuth(MOCK_TOKEN.STUDENT),
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
        .spyOn(codeTable, 'apiCodetablesV6ErrorCodesGet')
        .mockResolvedValue(sampleCatalogue)

      const first = await service.getErrorCodeDescriptions()
      const second = await service.getErrorCodeDescriptions()

      expect(first).toEqual(sampleCatalogue)
      expect(second).toEqual(sampleCatalogue)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('does not memoise an empty body — retries on the next call', async () => {
      const spy = jest
        .spyOn(codeTable, 'apiCodetablesV6ErrorCodesGet')
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
        .spyOn(codeTable, 'apiCodetablesV6ErrorCodesGet')
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
