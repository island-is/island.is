export interface CitizenshipApplication {
  selectedChildren: {
    nationalId: string
    otherParentNationalId?: string
    otherParentBirtDate?: Date
    otherParentName?: string
  }[]
  isFormerIcelandicCitizen: boolean
  givenName?: string | null
  familyName?: string | null
  fullName?: string
  address?: string | null
  postalCode?: string | null
  city?: string | null
  email: string
  phone: string
  citizenshipCode?: string | null
  residenceInIcelandLastChangeDate?: Date | null
  birthCountry?: string | null
  maritalStatusCode?: string
  dateOfMaritalStatus?: Date | null
  spouse?: {
    nationalId: string
    givenName?: string | null
    familyName?: string | null
    birthCountry?: string | null
    citizenshipCode?: string | null
    address?: string | null
    reasonDifferentAddress?: string
  }
  parents: {
    nationalId: string
    givenName?: string
    familyName?: string
  }[]
  countriesOfResidence: {
    countryId: string
  }[]
  staysAbroad: {
    countryId: string
    dateFrom?: Date
    dateTo?: Date
    purpose?: string
  }[]
  passport: {
    dateOfIssue: Date
    dateOfExpiry: Date
    passportNumber: string
    passportTypeId: number
    countryOfIssuerId: string
    file: { filename: string; base64: string }[]
  }
  supportingDocuments: {
    birthCertificate?: { filename: string; base64: string }[]
    subsistenceCertificate: { filename: string; base64: string }[]
    subsistenceCertificateForTown: { filename: string; base64: string }[]
    certificateOfLegalResidenceHistory: { filename: string; base64: string }[]
    icelandicTestCertificate: { filename: string; base64: string }[]
    criminalRecordList: {
      filename: string
      base64: string
      countryId: string
    }[]
  }
  children: {
    nationalId: string
    fullName: string
    givenName?: string | null
    familyName?: string | null
  }[]
  childrenPassport: {
    nationalId: string
    dateOfIssue: Date
    dateOfExpiry: Date
    passportNumber: string
    passportTypeId: number
    countryIdOfIssuer: string
    file: { filename: string; base64: string }[]
  }[]
  childrenSupportingDocuments: {
    nationalId: string
    birthCertificate: { filename: string; base64: string }[]
    writtenConsentFromChild?: { filename: string; base64: string }[]
    writtenConsentFromOtherParent?: { filename: string; base64: string }[]
    custodyDocuments: { filename: string; base64: string }[]
  }[]
}

export interface CurrentResidencePermit {
  nationalId: string
  permitTypeId: number
  permitTypeName: string
  permitValidTo: Date
  canApplyRenewal: {
    canApply: boolean
    reason?: string | null
  }
  canApplyPermanent: {
    canApply: boolean
  }
}

export interface CurrentResidencePermitType {
  isPermitTypeFamily: boolean
  isPermitTypeStudy: boolean
  isPermitTypeEmployment: boolean
  isWorkPermitTypeEmploymentServiceAgreement: boolean
  isWorkPermitTypeEmploymentOther: boolean
  isWorkPermitTypeSpecial: boolean
}

export interface CriminalRecord {
  countryId: string
  countryName: string
  date?: Date | null
  offenceDescription?: string | null
  punishmentDescription?: string | null
}

export interface Study {
  schoolNationalId: string
  schoolName: string
}

export interface Agent {
  nationalId: string
  name: string
  phone?: string | null
  email?: string | null
}
