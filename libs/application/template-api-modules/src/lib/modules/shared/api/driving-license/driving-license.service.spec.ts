import { YES, NO } from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'

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
  })
})
