import { MANUAL, NO, YES } from './constants'

export type OtherParent = typeof NO | typeof MANUAL | undefined
export type Boolean = typeof NO | typeof YES

export type Period = {
  startDate: string
  endDate: string
  ratio: number
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
