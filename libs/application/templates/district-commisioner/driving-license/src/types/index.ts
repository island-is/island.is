import { FormValue } from '@island.is/application/types'

export type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}

export enum Pickup {
  'POST' = 'post',
  'DISTRICT' = 'district',
}

export type ConditionFn = (answer: FormValue) => boolean

export type DrivingLicenseCategory = {
  nr: string
  validToCode: number
  issued?: string
}

export interface Remark {
  code: string
  description: string
}

export type DrivingLicense = {
  currentLicense: string | null
  remarks?: Remark[]
  categories: DrivingLicenseCategory[]
}
