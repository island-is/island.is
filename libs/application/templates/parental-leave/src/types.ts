import { YES, NO } from './constants'

export interface PersonInformation {
  fullName: string
  genderCode: string
  children: {
    nationalId: string
    fullName: string
    otherParent: {
      nationalId: string
    }
  }[]
  spouse?: {
    nationalId?: string
    name?: string
  }
}

export type YesOrNo = typeof NO | typeof YES

export interface Period {
  startDate: string
  endDate: string
  ratio: string
  firstPeriodStart?: string
  useLength?: YesOrNo
  daysToUse?: string
  rawIndex?: number
}

export interface Payment {
  date: string
  taxAmount: number
  pensionAmount: number
  estimatedAmount: number
  privatePensionAmount: number
  unionAmount: number
  estimatePayment: number
  period: {
    from: string
    to: string
    ratio: number
    approved: boolean
    paid: boolean
  }
}

export interface Payments {
  bank: string,
  pensionFund: string,
  privatePensionFund: string,
  privatePensionFundPercentage: string,
  union: string,
}
