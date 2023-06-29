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
  base64: string
}
