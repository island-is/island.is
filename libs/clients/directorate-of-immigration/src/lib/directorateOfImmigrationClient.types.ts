export interface CitizenshipApplication {
  selectedChildren: {
    nationalId: string
    otherParentNationalId?: string
    otherParentBirtDate?: Date
    otherParentName?: string
    citizenship?: string
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
  maritalStatus?: string
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
    dateFrom?: Date
    dateTo?: Date
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
    file: { filename: string; fileUrl: string }[]
  }
  supportingDocuments: {
    birthCertificate?: { filename: string; fileUrl: string }[]
    subsistenceCertificate: { filename: string; fileUrl: string }[]
    subsistenceCertificateForTown: { filename: string; fileUrl: string }[]
    certificateOfLegalResidenceHistory: { filename: string; fileUrl: string }[]
    icelandicTestCertificate: { filename: string; fileUrl: string }[]
    criminalRecord: {
      filename: string
      fileUrl: string
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
    file: { filename: string; fileUrl: string }[]
  }[]
  childrenSupportingDocuments: {
    nationalId: string
    birthCertificate: { filename: string; fileUrl: string }[]
    writtenConsentFromChild?: { filename: string; fileUrl: string }[]
    writtenConsentFromOtherParent?: { filename: string; fileUrl: string }[]
    custodyDocuments: { filename: string; fileUrl: string }[]
  }[]
}
