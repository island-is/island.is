import { TrWebCommonsExternalPortalsApiModelsDocumentsDocument } from '../../gen/fetch'

export interface Period {
  year: number
  month: number
}

export interface DomesticBankInfo {
  bank: string
}

export interface ForeignBankInfo {
  iban: string
  swift: string
  foreignBankName: string
  foreignBankAddress: string
  foreignCurrency: string
}

export interface TaxInfo {
  personalAllowance: boolean
  personalAllowanceUsage?: number
  taxLevel: number
}

export interface ApplicantInfo {
  email: string
  phonenumber: string
}

export interface ApplicationDTO {
  period?: Period
  comment?: string
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
  uploads?: Array<TrWebCommonsExternalPortalsApiModelsDocumentsDocument>
}

export enum DocumentTypeEnum {
  PENSION = 'pension',
  OTHER = 'other',
  RETIREMENT = 'retirement',
  SAILOR = 'sailor',
  SELF_EMPLOYED = 'selfEmployed',
  RENTAL_AGREEMENT = 'rentalAgreement',
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
}
