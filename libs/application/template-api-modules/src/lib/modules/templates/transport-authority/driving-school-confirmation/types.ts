export interface DrivingSchool {
  nationalId: string
  name: string
  address: string
  zipCode: string
  phoneNumber: string
  email: string
  website: string
  allowedDrivingSchoolTypes: string[]
}

export interface DrivingSchoolType {
  schoolTypeId: number
  schoolTypeName: string
  schoolTypeCode: string
  licenseCategory: string
}
