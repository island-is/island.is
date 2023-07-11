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
  name?: string
  address?: string | null
  postalCode?: string | null
  email: string
  phone: string
  citizenshipCode?: string | null
  residenceInIcelandLastChangeDate?: Date | null
  birthCountry?: string | null
  maritalStatusCode?: string
  dateOfMaritalStatus?: Date | null
  spouse?: {
    nationalId: string
    name: string
    birthCountry?: string | null
    citizenshipCode?: string | null
    address?: string | null
    reasonDifferentAddress?: string
  }
  parents: {
    nationalId: string
    name: string
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
    birthCertificate?: { base64: string }
    subsistenceCertificate: { base64: string }
    subsistenceCertificateForTown: { base64: string }
    certificateOfLegalResidenceHistory: { base64: string }
    icelandicTestCertificate: { base64: string }
    criminalRecordList: [{ countryId: number; base64: string }]
  }
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
