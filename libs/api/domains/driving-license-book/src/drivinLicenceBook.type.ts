export interface GetStudentListInput {
  key?: string
  licenseCategory?: string
  cursor?: string
  limit?: number
}

export interface StudentList {
  data: Array<ActorStudent> | null
  nextCursor: string | null
}

export interface ActorStudent {
  id: string | null
  ssn: string | null
  name: string | null
  zipCode: number | null
  address: string | null
  email: string | null
  primaryPhoneNumber: string | null
  secondaryPhoneNumber: string | null
  active?: boolean
  bookLicenseCategories: string[] | null
}

export const LICENSE_CATEGORY = "B"
