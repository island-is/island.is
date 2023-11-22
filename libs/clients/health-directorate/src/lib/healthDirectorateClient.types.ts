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
