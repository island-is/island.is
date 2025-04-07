import { MessageDescriptor } from 'react-intl'
import { BankAccountType } from './lib/constants'
export interface BankInfo {
  bank?: string
  ledger?: string
  accountNumber?: string
  iban?: string
  swift?: string
  foreignBankName?: string
  foreignBankAddress?: string
  currency?: string
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
