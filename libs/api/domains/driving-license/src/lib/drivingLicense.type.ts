export interface DrivingLicense {
  id: number
  name: string
  issued: string
  expires: string
  isProvisional: boolean
  eligibilities: {
    id: string
    issued: string
    expires: string
    comment: string
  }[]
}

export interface StudentInformation {
  name: string
}

export interface DrivingLicenseType {
  id: string
  name: string
}

export interface PenaltyPointStatus {
  nationalId: string
  isPenaltyPointsOk: boolean
}

export interface NewDrivingLicenseInput {
  juristictionId: number
  needsToPresentHealthCertificate: boolean
}

export interface NewDrivingLicenseResult {
  success: boolean
  errorMessage: string | null
}

export interface NewDrivingAssessmentResult {
  success: boolean
  errorMessage: string | null
}

export interface TeachingRightsStatus {
  nationalId: string
  hasTeachingRights: boolean
}

export interface StudentQueryInput {
  nationalId: string
}

export interface Juristiction {
  id: number
  name: string
  zip: number
}
