import { MessageDescriptor } from 'react-intl'
import { BankAccountType, RatioType } from './lib/constants'

export interface BankInfo {
  bank?: string
  ledger?: string
  accountNumber?: string
  iban?: string
  swift?: string
  foreignBankName?: string
  foreignBankAddress?: string
  currency?: string
  bankNumber?: string // used in BankAccountFormField
}

export interface ApplicantInfo {
  bankAccount?: BankInfo
  phoneNumber?: string
  emailAddress?: string
}

export interface PaymentInfo {
  bankAccountType: BankAccountType
  bank?: string
  ledger?: string
  accountNumber?: string
  iban?: string
  swift?: string
  bankName?: string
  bankAddress?: string
  currency?: string
}

export interface Attachments {
  attachments: FileType[]
  label: MessageDescriptor
}

export interface FileType {
  key: string
  name: string
}

export interface AdditionalInformation {
  additionalDocuments?: FileType[]
  additionalDocumentsRequired?: FileType[]
}

export interface Eligible {
  isEligible: boolean
  reason: string
  reasonCode: string
}

export interface CategorizedIncomeTypes {
  categoryCode?: string | null
  categoryName?: string | null
  categoryNumber?: number
  incomeTypeCode?: string | null
  incomeTypeName?: string | null
  incomeTypeNumber?: number
}

export interface IncomePlanRow {
  incomeType: string
  incomeTypeNumber: number
  incomeTypeCode: string
  currency: string
  incomeCategory: string
  incomeCategoryNumber: number
  incomeCategoryCode: string
  income: RatioType
  equalForeignIncomePerMonth?: string
  equalIncomePerMonth?: string
  incomePerYear: string
  unevenIncomePerYear?: string
  january?: string
  february?: string
  march?: string
  april?: string
  may?: string
  june?: string
  july?: string
  august?: string
  september?: string
  october?: string
  november?: string
  december?: string
}

export interface IncomePlanConditions {
  incomePlanYear: number
  showTemporaryCalculations: boolean
}
