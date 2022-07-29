export interface DriversLicenseCategory {
  id: number
  name: string
  issued: Date | null
  expires: Date | null
  comments: string | null
}

export interface DriversLicense {
  id: number
  name: string
  issued?: Date | null
  expires?: Date | null
  categories: DriversLicenseCategory[]
  healthRemarks?: string[]
}

export interface Teacher {
  nationalId: string
  name: string
}

export interface Juristiction {
  id: number
  name: string
  zip: number
}

export interface DrivingAssessment {
  nationalIdStudent: string
  nationalIdTeacher: string
  created: Date | null
}

export interface QualityPhoto {
  data: string
}

export type CanApplyErrorCodeBTemporary =
  | 'PERSON_NOT_FOUND_IN_NATIONAL_REGISTRY'
  | 'NO_LICENSE_FOUND'
  | 'PERSON_NOT_17_YEARS_OLD'
  | 'HAS_DEPRIVATION'
  | 'HAS_NO_PHOTO'
  | 'HAS_NO_SIGNATURE'
  | 'HAS_B_CATEGORY'

export type CanApplyErrorCodeBFull =
  | 'HAS_POINTS'
  | 'NO_TEMP_LICENSE'
  | 'HAS_DEPRIVATION'

export type CanApplyErrorCodeBRenew =
  | 'HAS_POINTS'
  | 'NO_LICENSE_FOUND'
  | 'HAS_DEPRIVATION'
  | 'LICENSE_NOT_RENEWABLE'

export interface CanApplyForCategoryResult<
  T extends
    | CanApplyErrorCodeBFull
    | CanApplyErrorCodeBTemporary
    | CanApplyErrorCodeBRenew
> {
  result: boolean
  errorCode?: T | undefined
}

export interface Category {
  id: string
  name: string
}
