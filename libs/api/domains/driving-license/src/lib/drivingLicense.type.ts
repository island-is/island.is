export interface DrivingLicense {
  id: number
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

export interface DrivingLicenseType {
  id: string
  name: string
}

export interface PenaltyPointStatus {
  nationalId: string
  isPenaltyPointsOk: boolean
}
