export type DrivingLicenseCategory = {
  id: number
  name: string
  issued: Date | null
  expires: Date | string | null
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
