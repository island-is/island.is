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

// Local mirror of the national-registry address shape (schema type
// `NationalRegistryAddress`). Defined here instead of importing
// `NationalRegistryUser` from `@island.is/api/schema` because this template's
// API-reachable utils are compiled during `application-system-api` backend
// schema codegen, which runs before `@island.is/api/schema` is generated —
// importing the generated client there creates an ordering cycle that fails CI.
export type NationalRegistryAddress = {
  streetAddress?: string | null
  postalCode?: string | null
  city?: string | null
}

export type DrivingLicense = {
  currentLicense: string | null
  remarks?: Remark[]
  categories: DrivingLicenseCategory[]
}
