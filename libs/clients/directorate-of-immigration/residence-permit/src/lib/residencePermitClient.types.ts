export interface Country {
  id: number
  name: string
}

export interface TravelDocumentType {
  id: number
  name: string
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

export interface StayAbroad {
  countryId: number
  countryName: string
  dateFrom?: Date | null
  dateTo?: Date | null
  purposeOfStay?: string | null
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

export interface Agent {
  nationalId: string
  name: string
  phone?: string | null
  email?: string | null
}
