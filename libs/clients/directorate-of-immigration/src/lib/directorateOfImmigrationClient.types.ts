export interface ResidenceCondition {
  conditionId: number
  conditionName: string
  isTypeMaritalStatus: boolean
}

export interface Country {
  id: number
  name: string
}

export interface TravelDocumentType {
  id: number
  name: string
}

export interface CountryOfResidence {
  countryId: number
  countryName: string
}

export interface StayAbroad {
  countryId: number
  countryName: string
  dateFrom?: Date | null
  dateTo?: Date | null
  purposeOfStay?: string | null
}

export interface Passport {
  dateOfIssue?: Date | null
  dateOfExpiry?: Date | null
  name?: string | null
  passportNo?: string | null
  passportTypeId?: number | null
  passportTypeName?: string | null
  issuingCountryId?: number | null
  issuingCountryName?: string | null
}

export interface ForeignCriminalRecordFile {
  countryId: number
  countryName: string
  base64: string
}

export interface CitizenshipApplication {
  selectedChildren: string[]
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
    countryId: number
  }[]
  staysAbroad: {
    countryId: number
    dateFrom?: Date
    dateTo?: Date
    purpose?: string
  }[]
  passport: {
    dateOfIssue: Date
    dateOfExpiry: Date
    passportNumber: string
    passportTypeId: number
    countryOfIssuerId: number
  }
  supportingDocuments: {
    birthCertificate?: { base64: string }[]
    subsistenceCertificate: { base64: string }[]
    subsistenceCertificateForTown: { base64: string }[]
    certificateOfLegalResidenceHistory: { base64: string }[]
    icelandicTestCertificate: { base64: string }[]
    criminalRecordList: { countryId: number; base64: string }[]
  }
  children: {
    nationalId: string
    fullName: string
  }[]
  childrenPassport: {
    nationalId: string
    dateOfIssue: Date
    dateOfExpiry: Date
    passportNumber: string
    passportTypeId: number
    countryIdOfIssuer: number
  }[]
  childrenSupportingDocuments: {
    nationalId: string
    birthCertificate: { base64: string }
    writtenConsentFromChild?: { base64: string }
    writtenConsentFromOtherParent?: { base64: string }
    custodyDocuments: { base64: string }
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
  countryId: number
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
