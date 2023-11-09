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
    name: string
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
