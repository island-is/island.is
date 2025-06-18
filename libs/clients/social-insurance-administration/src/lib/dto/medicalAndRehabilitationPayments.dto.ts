import {
  ApplicantInfo,
  DomesticBankInfo,
  EmployeeSickPay,
  Occupation,
  Period,
  SelfAssessment,
  TaxInfo,
  UnionSickPay,
} from '../socialInsuranceAdministrationClient.type'

export interface MedicalAndRehabilitationPaymentsDTO {
  period?: Period
  comment?: string
  reasons?: Array<string>
  applicationId?: string
  domesticBankInfo?: DomesticBankInfo
  taxInfo?: TaxInfo
  applicantInfo?: ApplicantInfo
  occupation?: Occupation
  employeeSickPay?: EmployeeSickPay
  unionSickPay?: UnionSickPay
  selfAssessment?: SelfAssessment
  baseCertificateReference: string
  rehabilitationPlanReference: string
}
