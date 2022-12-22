export type HasQualityPhoto = {
  hasQualityPhoto: boolean
}
export type HasQualitySignature = {
  hasQualitySignature: boolean
}

export const YES = 'yes'
export const NO = 'no'

type FakeCurrentLicense = 'none' | 'temp'
type YesOrNo = 'yes' | 'no'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
  currentLicense?: FakeCurrentLicense
  healthRemarks?: YesOrNo
}

export type DrivingLicense = {
  currentLicense: string | null
  healthRemarks?: string[]
}

export interface StudentAssessment {
  studentNationalId: string
  teacherNationalId: string
  teacherName: string | null
}
