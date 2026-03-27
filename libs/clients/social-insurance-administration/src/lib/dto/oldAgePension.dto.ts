import { TrWebContractsExternalDigitalIcelandDocumentsDocument } from '../..'
import {
  ApplicantInfo,
  DomesticBankInfo,
  Period,
  TaxInfo,
  IncomePlanInfo,
  ForeignBankInfo,
  Employer,
} from '../socialInsuranceAdministrationClient.type'

export interface OldAgePensionDTO {
  period: Period
  comment?: string
  applicationId: string
  domesticBankInfo?: DomesticBankInfo
  foreignBankInfo?: ForeignBankInfo
  incomePlan: IncomePlanInfo
  taxInfo: TaxInfo
  applicantInfo: ApplicantInfo
  hasAbroadResidence: boolean
  hasOneTimePayment: boolean
  isSailorPension: boolean
  employment?: string
  employers?: Array<Employer>
  uploads?: Array<TrWebContractsExternalDigitalIcelandDocumentsDocument>
  awarenessOfIncomeDeclaration?: boolean
}
