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

export interface Employer {
  email: string
  phoneNumber?: string
  ratio: number
  ratioMonthly?: Months
}

export interface Months {
  january?: number
  february?: number
  march?: number
  april?: number
  may?: number
  june?: number
  july?: number
  august?: number
  septembe?: number
  october?: number
  november?: number
  december?: number
}

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
  uploads?: Array<TrWebCommonsExternalPortalsApiModelsDocumentsDocument>
  employment?: string
  employers?: Array<Employer>
}

export enum DocumentTypeEnum {
  PENSION = 'pension',
  OTHER = 'other',
  RETIREMENT = 'retirement',
  SAILOR = 'sailor',
  SELF_EMPLOYED = 'selfEmployed',
  RENTAL_AGREEMENT = 'rentalAgreement',
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
  ASSISTED_CARE_AT_HOME = 'assistedCareAtHome',
  PURCHASE_OF_HEARING_AIDS = 'purchaseOfHearingAids',
  ASSISTED_LIVING = 'assistedLiving',
  HALFWAY_HOUSE = 'halfwayHouse',
  HOUSE_RENT_AGREEMENT = 'houseRentAgreement',
  HOUSE_RENT_ALLOWANCE = 'houseRentAllowance',
}
