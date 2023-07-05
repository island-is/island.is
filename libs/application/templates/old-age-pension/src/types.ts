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
  Agust?: string
  September?: string
  October?: string
  November?: string
  December?: string
  yearly: string
}

export interface Employer {
  email: string
  phoneNumber?: number
  ratioType: RatioType
  ratioYearly?: string
  rawIndex?: number
  ratioMonthly?: monthObject
}

export interface ChildPensionRow {
  nationalIdOrBirthDate: string
  name: string
  editable?: boolean
}
