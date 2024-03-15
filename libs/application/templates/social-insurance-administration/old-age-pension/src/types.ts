import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'
import { RatioType } from './lib/constants'
export interface CombinedResidenceHistory {
  country: string
  periodFrom: Date
  periodTo: Date | string
}

type MonthObject = {
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
  selfEmployedAttachment?: FileType[]
}
