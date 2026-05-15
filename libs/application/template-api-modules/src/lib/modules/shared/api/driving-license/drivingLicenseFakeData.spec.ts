import { YES, NO } from '@island.is/application/core'
import {
  buildFakeQualityPhotoAndSignature,
  buildFakeAllPhotosFromThjodskra,
} from './drivingLicenseFakeData'
import { DrivingLicenseFakeData } from './types'

const baseFakeData: DrivingLicenseFakeData = {
  useFakeData: YES,
}

describe('drivingLicenseFakeData builders', () => {
  describe('buildFakeQualityPhotoAndSignature', () => {
    it('returns a fake quality photo object when hasRLSPhoto is "yes"', () => {
      const result = buildFakeQualityPhotoAndSignature({
        ...baseFakeData,
        hasRLSPhoto: YES,
      })
      expect(result).toMatchObject({
        imageId: 1,
        imageTypeId: 1,
        imageTypeName: 'Quality photo',
      })
      expect(typeof result?.pohto).toBe('string')
    })

    it('returns null when hasRLSPhoto is "no" (fake "no photo")', () => {
      const result = buildFakeQualityPhotoAndSignature({
        ...baseFakeData,
        hasRLSPhoto: NO,
      })
      expect(result).toBeNull()
    })

    it('returns undefined sentinel when hasRLSPhoto is "real"', () => {
      const result = buildFakeQualityPhotoAndSignature({
        ...baseFakeData,
        hasRLSPhoto: 'real',
      })
      expect(result).toBeUndefined()
    })

    it('returns null when hasRLSPhoto is unset (legacy default)', () => {
      const result = buildFakeQualityPhotoAndSignature({
        ...baseFakeData,
      })
      expect(result).toBeNull()
    })
  })

  describe('buildFakeAllPhotosFromThjodskra', () => {
    it('returns an images array with one fake photo when hasThjodskraPhoto is "yes"', () => {
      const result = buildFakeAllPhotosFromThjodskra({
        ...baseFakeData,
        hasThjodskraPhoto: YES,
      })
      expect(result).toEqual({
        images: [
          expect.objectContaining({
            biometricId: 'fakeThjodskraBiometricId',
            contentSpecification: 'FACIAL',
          }),
        ],
      })
    })

    it('returns an empty images array when hasThjodskraPhoto is "no" (fake "no photo")', () => {
      const result = buildFakeAllPhotosFromThjodskra({
        ...baseFakeData,
        hasThjodskraPhoto: NO,
      })
      expect(result).toEqual({ images: [] })
    })

    it('returns undefined sentinel when hasThjodskraPhoto is "real"', () => {
      const result = buildFakeAllPhotosFromThjodskra({
        ...baseFakeData,
        hasThjodskraPhoto: 'real',
      })
      expect(result).toBeUndefined()
    })

    it('returns empty images array when hasThjodskraPhoto is unset (legacy default)', () => {
      const result = buildFakeAllPhotosFromThjodskra({
        ...baseFakeData,
      })
      expect(result).toEqual({ images: [] })
    })
  })
})
