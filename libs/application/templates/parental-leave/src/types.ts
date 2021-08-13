import { YES, NO } from './constants'

export type YesOrNo = typeof NO | typeof YES

export interface Period {
  startDate: string
  endDate: string
  ratio: string
  duration: string
  days: string
  percentage: string
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
