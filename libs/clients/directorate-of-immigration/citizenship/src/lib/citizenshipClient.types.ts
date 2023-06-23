export interface ResidenceCondition {
  id: number
  name: string
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
  dateFrom?: Date
  dateTo?: Date
  purposeOfStay?: string | null
}

export interface Passport {
  dateOfIssue?: Date | null
  dateOfExpiry?: Date | null
  name?: string | null
  passportNo?: string | null
  passportTypeId?: number
  passportTypeName?: string | null
  issuingCountryId?: number
  issuingCountryName?: string | null
}
