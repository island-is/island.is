import {
  ApplicantInfo,
  DomesticBankInfo,
  EmployeeSickPay,
  Occupation,
  Period,
  PreQuestionnaire,
  SelfAssessment,
  TaxInfo,
  UnionSickPay,
  IncomePlanInfo,
} from '../socialInsuranceAdministrationClient.type'

export interface MedicalAndRehabilitationPaymentsDTO {
  period?: Period
  comment?: string
  applicationId?: string
  domesticBankInfo?: DomesticBankInfo
  taxInfo?: TaxInfo
  applicantInfo?: ApplicantInfo
  occupation?: Occupation
  employeeSickPay?: EmployeeSickPay
  unionSickPay?: UnionSickPay
  preQuestionnaire?: PreQuestionnaire
  selfAssessment?: SelfAssessment
  baseCertificateReference: string
  rehabilitationPlanReference?: string
  incomePlan?: IncomePlanInfo
}
