import { RatioType } from './lib/constants'

export interface combinedResidenceHistory {
  country: string
  periodFrom: Date
  periodTo: Date | string
}

type monthObject = {
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
  ratioMonthly?: monthObject
  ratioMonthlyAvg?: string
}

export interface ChildPensionRow {
  nationalIdOrBirthDate: string
  name: string
  editable?: boolean
}
