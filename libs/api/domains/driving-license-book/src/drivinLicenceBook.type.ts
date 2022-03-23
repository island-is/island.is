export const LICENSE_CATEGORY = 'B'

export interface DrivingLicenseBookStudentForTeacher {
  id: string
  nationalId: string
  name: string
  totalLessonCount: number
}

export interface DrivingLicenseBookStudent {
  id: string
  nationalId: string
  name: string
  zipCode: number
  address: string
  email: string
  primaryPhoneNumber: string
  secondaryPhoneNumber: string
  active: boolean
  bookLicenseCategories: string[]
}
