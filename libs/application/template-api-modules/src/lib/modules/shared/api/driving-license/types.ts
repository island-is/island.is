import { YesOrNo } from '@island.is/application/core'

export type HasQualityPhoto = {
  hasQualityPhoto: boolean
}
export type HasQualitySignature = {
  hasQualitySignature: boolean
}

type FakeCurrentLicense = 'none' | 'temp' | 'B' | 'C' | 'C1' | 'D' | 'D1'

// 'yes' = inject fake photo, 'no' = inject "no photo" fake, 'real' = fall through to real data
export type FakePhotoMode = 'yes' | 'no' | 'real'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
  qualitySignature?: YesOrNo
  currentLicense?: FakeCurrentLicense
  remarks?: YesOrNo
  hasThjodskraPhoto?: FakePhotoMode
  hasRLSPhoto?: FakePhotoMode
}

export type DrivingLicenseCategory = {
  id: number
  name: string
  issued: Date | null
  expires: Date | null
  comments: string | null
  validToText?: string | null
  validToCode?: number | null
  nr?: string | null
}

export interface Remark {
  code: string
  description: string
}

export type DrivingLicense = {
  currentLicense: string | null
  remarks?: Remark[]
  categories?: DrivingLicenseCategory[]
  id?: number
  birthCountry?: string | null
  issued?: Date | null
  expires?: Date | null
  publishPlaceName?: string | null
}

export interface StudentAssessment {
  studentNationalId: string
  teacherNationalId: string
  teacherName: string | null
}
