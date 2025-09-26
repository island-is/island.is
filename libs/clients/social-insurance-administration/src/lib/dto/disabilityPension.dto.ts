import {
  ApplicantInfo,
  DomesticBankInfo,
  ForeignBankInfo,
  IncomePlanInfo,
  Period,
  SelfAssessment,
  TaxInfo,
} from '../socialInsuranceAdministrationClient.type'

export interface DisabilityPensionDto {
  taxInfo: TaxInfo
  hasAppliedForDisabilityAtPensionFund: boolean
  isInPaidEmployment: boolean
  plansToContinueParticipation?: boolean
  housingTypeAdditionalDescription?: string
  numberOfChildrenInHome: string
  languageProficiency: number
  applicantNativeLanguage: string
  applicantNativeLanguageOther?: string
  hasBeenInPaidEmployment: boolean
  lastProfession?: string
  lastProfessionYear?: number
  lastProfessionDescription?: string
  lastActivityOfProfession?: string
  lastActivityOfProfessionDescription?: string
  educationalLevel: string
  workCapacityAssessment: number
  importanceOfEmployment: number
  hasBeenInRehabilitationOrTreatment: boolean
  rehabilitationOrTreatment?: string
  rehabilitationOrTreatmentOutcome?: string
  workIncapacityIssue?: string
  foreignPaymentDetails: {
    receivesForeignPayments: boolean
    foreignPaymentDetails?: Array<{
      countryName: string
      countryCode: string
      foreignNationalId?: string
    }>
  }
  housingTypeId: number
  maritalStatusTypeId: number
  selfAssessment: SelfAssessment
  employmentStatuses: Array<{
    employmentStatus: string
    explanation?: string
  }>
  incomePlan: IncomePlanInfo
  foreignResidencies?: Array<{
    countryName: string
    countryCode: string
    foreignNationalId: string
    dateFrom: string
    dateTo: string
  }>
  retroactivePayments: Period
  applicantInfo: ApplicantInfo
  period?: Period
  comment?: string
  applicationId: string
  domesticBankInfo?: DomesticBankInfo
  foreignBankInfo?: ForeignBankInfo
}
