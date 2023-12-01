import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'
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

export interface IncompleteEmployer {
  email?: string
  phoneNumber?: string
  ratioType?: RatioType
  ratioYearly?: string
  ratioMonthlyAvg?: string
}
export interface FileUpload {
  earlyRetirement?: FileType[]
  pension?: FileType[]
  fishermen?: FileType[]
}

export interface SelfEmployed {
  SelfEmployedAttachment?: FileType[]
}
