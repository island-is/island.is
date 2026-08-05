import { Test } from '@nestjs/testing'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { DrivingLicenseApiConfig } from './drivingLicenseApi.config'
import { DrivingLicenseApi } from './drivingLicenseApi.service'
import { startMocking } from '@island.is/shared/mocking'
import { LoggingModule } from '@island.is/logging'
import { DrivingLicenseApiModule } from './drivingLicenseApi.module'
import { exportedApis } from './apiConfiguration'
import { CodeTableV5 } from '../v5'

import { MOCK_TOKEN, requestHandlers } from './__mock-data__/requestHandlers'

startMocking(requestHandlers)
describe('DrivingLicenseDuplicateService', () => {
  let service: DrivingLicenseApi
  let codeTable: CodeTableV5

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
