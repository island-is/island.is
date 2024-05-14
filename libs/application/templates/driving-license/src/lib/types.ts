import { FormValue } from '@island.is/application/types'

export type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}

export type DrivingLicenseCategory = {
  nr: string
}

export type ConditionFn = (answer: FormValue) => boolean

export type DrivingLicense = {
  currentLicense: string | null
  remarks?: string[]
  categories: DrivingLicenseCategory[]
}
