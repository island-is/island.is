export type DrivingLicenseCategory = {
  // Legacy RLS records carry the category letter in `name` with an empty `nr`,
  // so both are optional/nullable and code readers must fall back `nr || name`.
  nr?: string | null
  name?: string | null
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
