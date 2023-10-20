import { RatioType } from './lib/constants'

export interface CombinedResidenceHistory {
  country: string
  periodFrom: Date
  periodTo: Date | string
}

type MonthObject = {
  January?: string
  February?: string
  March?: string
  April?: string
  May?: string
  June?: string
  July?: string
  August?: string
  September?: string
  October?: string
  November?: string
  December?: string
  yearly: string
}

export interface Employer {
  email: string
  phoneNumber?: string
  ratioType: RatioType
  ratioYearly?: string
  rawIndex?: number
  ratioMonthly?: MonthObject
  ratioMonthlyAvg?: string
}

export interface ChildPensionRow {
  nationalIdOrBirthDate: string
  name: string
  editable?: boolean
  childDoesNotHaveNationalId: boolean
}

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
