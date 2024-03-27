export interface HealthcareLicense {
  professionId: string
  professionNameIs: string
  professionNameEn: string
  specialityList: {
    specialityNameIs: string
    specialityNameEn: string
  }[]
  isTemporary: boolean
  validTo?: Date
  isRestricted: boolean
}

export interface HealthcareLicenseCertificateRequest {
  fullName: string
  dateOfBirth: Date
  email: string
  phone: string
  professionIdList: string[]
}

export interface HealthcareLicenseCertificate {
  professionId: string
  base64: string
}

export type HealthDirectorateLicenseStatus =
  | 'VALID'
  | 'LIMITED'
  | 'INVALID'
  | 'UNKNOWN'
  | 'REVOKED'
  | 'WAIVED'

export interface HealthDirectorateLicenseToPractice {
  id: number
  legalEntityId: string
  licenseHolderNationalId: string
  licenseHolderName: string
  profession: string
  practice: string
  licenseNumber: string
  validFrom: Date
  validTo?: Date
  status: HealthDirectorateLicenseStatus
}
