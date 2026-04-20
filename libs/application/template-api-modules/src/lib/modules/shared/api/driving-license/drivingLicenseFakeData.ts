import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  DrivingLicenseFakeData,
  HasQualitySignature,
  StudentAssessment,
} from './types'
import { getTodayDateWithMonthDiff } from './utils'

export const getFakeData = (
  answers: FormValue,
): DrivingLicenseFakeData | null => {
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(answers, 'fakeData')
  return fakeData?.useFakeData === YES ? fakeData : null
}

export const buildFakeCurrentLicense = (fakeData: DrivingLicenseFakeData) => {
  const currentLicense = (() => {
    switch (fakeData.currentLicense) {
      case 'temp':
        return 'B'
      case 'B':
      case 'C':
      case 'C1':
      case 'D':
      case 'D1':
        return fakeData.currentLicense
      default:
        return null
    }
  })()

  return {
    currentLicense,
    categories: [
      {
        id: Math.floor(Math.random() * 100000000),
        nr: currentLicense,
        name: currentLicense || '', // for useLegacyVersion
        issued: getTodayDateWithMonthDiff(-12),
        expires: getTodayDateWithMonthDiff(14 * 12), // license is valid for 15 years total
        comments: '',
      },
    ],
    remarks:
      fakeData.remarks === YES
        ? [
            {
              code: '',
              description:
                'Gervilimur eða gervilimir/stoðtæki fyrir fætur og hendur.',
            },
          ]
        : undefined,
    id: Math.floor(Math.random() * 100000000),
    birthCountry: undefined,
    issued: undefined,
    expires: undefined,
    publishPlaceName: undefined,
  }
}

export const buildFakeQualityPhoto = (fakeData: DrivingLicenseFakeData) => {
  return {
    hasQualityPhoto: fakeData.qualityPhoto === YES,
    qualityPhoto: null,
  }
}

export const buildFakeQualitySignature = (
  fakeData: DrivingLicenseFakeData,
): HasQualitySignature | null => {
  if (fakeData.qualitySignature === YES) {
    return { hasQualitySignature: true }
  }
  return null
}

export const buildFakeQualityPhotoAndSignature = (
  fakeData: DrivingLicenseFakeData,
) => {
  if (fakeData.hasRLSPhoto === YES) {
    return {
      imageId: 1,
      imageTypeId: 1,
      imageTypeName: 'Quality photo',
      imageDate: null,
      pohto:
        'iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAIAAACzY+a1AAABuUlEQVR4nO3OQQkAMAzAwIqcyMqciDxCIXACbmZfbvMHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8gdhPvkQiXuNETQ5AAAAAElFTkSuQmCC',
      signatureId: 1,
      signatureTypeId: 12,
      signatureTypeName: 'Quality signature',
      signatureDate: null,
      signature: null,
    }
  }
  return null
}

export const buildFakeAllPhotosFromThjodskra = (
  fakeData: DrivingLicenseFakeData,
) => {
  if (fakeData.hasThjodskraPhoto === YES) {
    return {
      images: [
        {
          biometricId: 'fakeThjodskraBiometricId',
          content:
            'iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAIAAACzY+a1AAABuUlEQVR4nO3OQQkAMAzAwFqdfxGdiDxCIXACbuZtbvMHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8geB/EEgfxDIHwTyB4H8QSB/EMgfBPIHgfxBIH8QyB8E8gdhPlNL4IkwXcFkAAAAAElFTkSuQmCC',
          contentSpecification: 'FACIAL',
        },
      ],
    }
  }
  return { images: [] }
}

export const buildFakeDrivingAssessment = (): StudentAssessment => {
  return {
    teacherNationalId: '123456-7890',
    teacherName: 'Bílar Kennar Ekilsson',
    studentNationalId: '123456-7890',
  }
}
