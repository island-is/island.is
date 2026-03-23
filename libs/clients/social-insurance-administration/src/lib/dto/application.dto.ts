import { TrWebContractsExternalDigitalIcelandDocumentsDocument } from '../..'
import {
  Period,
  DomesticBankInfo,
  ForeignBankInfo,
  TaxInfo,
  ApplicantInfo,
  Employer,
  SpouseTaxCardUsage,
  IncomePlanInfo,
} from '../socialInsuranceAdministrationClient.type'

export interface ApplicationDTO {
  period?: Period
  comment?: string
  reasons?: Array<string>
  applicationId?: string
  domesticBankInfo?: DomesticBankInfo
  foreignBankInfo?: ForeignBankInfo
  taxInfo?: TaxInfo
  applicantInfo?: ApplicantInfo
  hasAbroadResidence?: boolean
  hasOneTimePayment?: boolean
  isSailorPension?: boolean
  isRental?: boolean
  hasAStudyingAdolescenceResident?: boolean
  uploads?: Array<TrWebContractsExternalDigitalIcelandDocumentsDocument>
  employment?: string
  employers?: Array<Employer>
  deceasedNationalId?: string
  childrenNationalIds?: string[]
  spouseTaxCardUsage?: SpouseTaxCardUsage
  incomePlan?: IncomePlanInfo
  livesAloneUserReply?: boolean
  livesAloneNationalRegistryData?: boolean
}
