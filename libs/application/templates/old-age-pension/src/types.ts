import { RatioType } from './lib/constants'

export interface combinedResidenceHistory {
  country: string
  periodFrom: Date
  periodTo: Date | string
}

export interface Employer {
  email: string
  phoneNumber: number
  ratioYearly?: string
  rawIndex?: number
  ratioType: RatioType
  //ratioMonthly?: object // need to do
}
