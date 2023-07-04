import { RatioType } from './lib/constants'

export interface combinedResidenceHistory {
  country: string
  periodFrom: Date
  periodTo: Date | string
}

export interface Employer {
  email: string
  phoneNumber?: number
  ratioType: RatioType
  ratioYearly?: string
  rawIndex?: number
  //ratioMonthly?: object // need to do
}
