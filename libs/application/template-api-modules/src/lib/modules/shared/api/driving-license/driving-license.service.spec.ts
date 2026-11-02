import { YES, NO } from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
} from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { TemplateApiError } from '@island.is/nest/problem'

import { DrivingLicenseProviderService } from './driving-license.service'

describe('DrivingLicenseProviderService — fakeData photo modes', () => {
  let drivingLicenseService: any
  let drivingLicenseBookService: any
  let logger: {
    info: jest.Mock
    warn: jest.Mock
    error: jest.Mock
    log: jest.Mock
  }
  let service: DrivingLicenseProviderService

  beforeEach(() => {
    drivingLicenseService = {
      getQualityPhotoAndSignature: jest.fn(async () => ({
        imageId: 999,
        imageTypeId: 1,
        imageTypeName: 'Real photo',
        pohto: 'real-base64',
      })),
      getAllPhotosFromThjodskra: jest.fn(async () => ({
        images: [
          {
            biometricId: 'real-biometric-id',
            content: 'real-content',
            contentSpecification: 'FACIAL',
          },
        ],
      })),
    }
    drivingLicenseBookService = {}
    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
    }
    service = new DrivingLicenseProviderService(
      drivingLicenseService,
      drivingLicenseBookService,
      logger as any,
    )
  })

  const buildProps = (fakeData?: {
    [key: string]: string | number | boolean
  }) => ({
    auth: createCurrentUser(),
    application: createApplication({
      answers: fakeData ? { fakeData } : {},
      typeId: ApplicationTypes.DRIVING_LICENSE,
      status: ApplicationStatus.IN_PROGRESS,
    }),
    currentUserLocale: 'is' as const,
  })

  describe('qualityPhotoAndSignature', () => {
    it('falls through to real service when hasRLSPhoto = "real"', async () => {
      const result = await service.qualityPhotoAndSignature(
        buildProps({ useFakeData: YES, hasRLSPhoto: 'real' }),
      )
      expect(
        drivingLicenseService.getQualityPhotoAndSignature,
      ).toHaveBeenCalledTimes(1)
      expect(result).toMatchObject({ imageTypeName: 'Real photo' })
    })

    it('returns fake photo data and skips real service when hasRLSPhoto = "yes"', async () => {
      const result = await service.qualityPhotoAndSignature(
        buildProps({ useFakeData: YES, hasRLSPhoto: YES }),
      )
      expect(
        drivingLicenseService.getQualityPhotoAndSignature,
      ).not.toHaveBeenCalled()
      expect(result).toMatchObject({ imageTypeName: 'Quality photo' })
    })

    it('returns null and skips real service when hasRLSPhoto = "no"', async () => {
      const result = await service.qualityPhotoAndSignature(
        buildProps({ useFakeData: YES, hasRLSPhoto: NO }),
      )
      expect(
        drivingLicenseService.getQualityPhotoAndSignature,
      ).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('falls through to real service when fakeData is absent (real user flow)', async () => {
      const result = await service.qualityPhotoAndSignature(buildProps())
      expect(
        drivingLicenseService.getQualityPhotoAndSignature,
      ).toHaveBeenCalledTimes(1)
      expect(result).toMatchObject({ imageTypeName: 'Real photo' })
    })

    it('logs when RLS returns metadata but no photo binary', async () => {
      drivingLicenseService.getQualityPhotoAndSignature = jest.fn(async () => ({
        imageId: 1390033,
        imageTypeId: 1,
        imageTypeName: 'Passamynd',
        imageDate: new Date('2015-04-17T13:02:16.390Z'),
        pohto: null,
        signature: 'sigbase64',
      }))
      const result = await service.qualityPhotoAndSignature(buildProps())
      expect(result).toMatchObject({ imageId: 1390033, pohto: null })
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('without binary'),
        expect.objectContaining({ imageTypeId: 1 }),
      )
    })

    it('does not log when RLS returns the full record with binary', async () => {
      await service.qualityPhotoAndSignature(buildProps())
      expect(logger.info).not.toHaveBeenCalled()
    })

    it('returns a failure marker when the RLS lookup throws', async () => {
      drivingLicenseService.getQualityPhotoAndSignature = jest.fn(async () => {
        throw new Error('502 Bad Gateway')
      })
      const result = await service.qualityPhotoAndSignature(buildProps())
      expect(result).toEqual({ fetchFailed: true })
    })
  })

  describe('allPhotosFromThjodskra', () => {
    it('falls through to real service when hasThjodskraPhoto = "real"', async () => {
      const result = await service.allPhotosFromThjodskra(
        buildProps({ useFakeData: YES, hasThjodskraPhoto: 'real' }),
      )
      expect(
        drivingLicenseService.getAllPhotosFromThjodskra,
      ).toHaveBeenCalledTimes(1)
      expect(result).toEqual({
        images: [expect.objectContaining({ biometricId: 'real-biometric-id' })],
      })
    })

    it('returns fake images and skips real service when hasThjodskraPhoto = "yes"', async () => {
      const result = await service.allPhotosFromThjodskra(
        buildProps({ useFakeData: YES, hasThjodskraPhoto: YES }),
      )
      expect(
        drivingLicenseService.getAllPhotosFromThjodskra,
      ).not.toHaveBeenCalled()
      expect(result).toEqual({
        images: [
          expect.objectContaining({ biometricId: 'fakeThjodskraBiometricId' }),
        ],
      })
    })

    it('returns empty images and skips real service when hasThjodskraPhoto = "no"', async () => {
      const result = await service.allPhotosFromThjodskra(
        buildProps({ useFakeData: YES, hasThjodskraPhoto: NO }),
      )
      expect(
        drivingLicenseService.getAllPhotosFromThjodskra,
      ).not.toHaveBeenCalled()
      expect(result).toEqual({ images: [] })
    })

    it('falls through to real service when fakeData is absent (real user flow)', async () => {
      const result = await service.allPhotosFromThjodskra(buildProps())
      expect(
        drivingLicenseService.getAllPhotosFromThjodskra,
      ).toHaveBeenCalledTimes(1)
      expect(result).toMatchObject({
        images: [expect.objectContaining({ biometricId: 'real-biometric-id' })],
      })
    })

    it('returns empty images with a failure marker when the lookup throws', async () => {
      drivingLicenseService.getAllPhotosFromThjodskra = jest.fn(async () => {
        throw new Error('502 Bad Gateway')
      })
      const result = await service.allPhotosFromThjodskra(buildProps())
      expect(result).toEqual({ images: [], fetchFailed: true })
    })
  })

  describe('photoLookupCheck', () => {
    const entry = (data: object) => ({
      data,
      date: new Date(),
      status: 'success' as const,
    })
    const thjodskraFailed = entry({ images: [], fetchFailed: true })
    const thjodskraFacial = entry({
      images: [{ biometricId: 'id', contentSpecification: 'FACIAL' }],
    })

    const check = (
      rlsPhotoSource: 'qualityPhoto' | 'qualityPhotoAndSignature',
      externalData: ExternalData,
    ) =>
      service.photoLookupCheck({
        ...buildProps(),
        application: createApplication({
          externalData,
          typeId: ApplicationTypes.DRIVING_LICENSE,
        }),
        params: { rlsPhotoSource },
      })

    describe('with qualityPhotoAndSignature as the license registry photo', () => {
      it('passes when no lookup failed, even without a photo', async () => {
        await expect(
          check('qualityPhotoAndSignature', {
            allPhotosFromThjodskra: entry({ images: [] }),
            qualityPhotoAndSignature: entry({ imageId: null }),
          }),
        ).resolves.toBeUndefined()
        expect(logger.info).not.toHaveBeenCalled()
      })

      it('throws when Thjodskra failed and the license registry has no photo', async () => {
        await expect(
          check('qualityPhotoAndSignature', {
            allPhotosFromThjodskra: thjodskraFailed,
            qualityPhotoAndSignature: entry({ imageId: null }),
          }),
        ).rejects.toBeInstanceOf(TemplateApiError)
        expect(logger.info).toHaveBeenCalledWith(
          expect.stringContaining('blocking data step'),
          {
            thjodskraLookupFailed: true,
            rlsLookupFailed: false,
            rlsPhotoSource: 'qualityPhotoAndSignature',
          },
        )
      })

      it('passes when Thjodskra failed but the license registry has a photo', async () => {
        await expect(
          check('qualityPhotoAndSignature', {
            allPhotosFromThjodskra: thjodskraFailed,
            qualityPhotoAndSignature: entry({ imageId: 123 }),
          }),
        ).resolves.toBeUndefined()
      })

      it('throws when the license registry failed and Thjodskra has no photo', async () => {
        await expect(
          check('qualityPhotoAndSignature', {
            allPhotosFromThjodskra: entry({ images: [] }),
            qualityPhotoAndSignature: entry({ fetchFailed: true }),
          }),
        ).rejects.toBeInstanceOf(TemplateApiError)
      })

      it('passes when the license registry failed but Thjodskra has a facial photo', async () => {
        await expect(
          check('qualityPhotoAndSignature', {
            allPhotosFromThjodskra: thjodskraFacial,
            qualityPhotoAndSignature: entry({ fetchFailed: true }),
          }),
        ).resolves.toBeUndefined()
      })

      it('throws when the license registry failed and Thjodskra has only non-facial images', async () => {
        await expect(
          check('qualityPhotoAndSignature', {
            allPhotosFromThjodskra: entry({
              images: [
                { biometricId: 'id', contentSpecification: 'SIGNATURE' },
              ],
            }),
            qualityPhotoAndSignature: entry({ fetchFailed: true }),
          }),
        ).rejects.toBeInstanceOf(TemplateApiError)
      })
    })

    describe('with qualityPhoto as the license registry photo', () => {
      it('throws when Thjodskra failed and there is no quality photo', async () => {
        await expect(
          check('qualityPhoto', {
            allPhotosFromThjodskra: thjodskraFailed,
            qualityPhoto: entry({ hasQualityPhoto: false, qualityPhoto: null }),
          }),
        ).rejects.toBeInstanceOf(TemplateApiError)
      })

      it('passes when Thjodskra failed but there is a quality photo', async () => {
        await expect(
          check('qualityPhoto', {
            allPhotosFromThjodskra: thjodskraFailed,
            qualityPhoto: entry({ hasQualityPhoto: true, qualityPhoto: 'b64' }),
          }),
        ).resolves.toBeUndefined()
      })

      it('ignores a qualityPhotoAndSignature failure it does not use', async () => {
        await expect(
          check('qualityPhoto', {
            allPhotosFromThjodskra: entry({ images: [] }),
            qualityPhoto: entry({ hasQualityPhoto: false, qualityPhoto: null }),
            qualityPhotoAndSignature: entry({ fetchFailed: true }),
          }),
        ).resolves.toBeUndefined()
      })
    })
  })
})
