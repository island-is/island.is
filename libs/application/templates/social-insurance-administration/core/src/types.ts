import { MessageDescriptor } from 'react-intl'

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

export interface Attachments {
  attachments: FileType[]
  label: MessageDescriptor
}

export interface FileType {
  key: string
  name: string
}
