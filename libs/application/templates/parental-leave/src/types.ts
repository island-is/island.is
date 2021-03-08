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

interface SelectItem {
  id: string
  name: string
}

export type UnionQuery = {
  getUnions: Array<SelectItem>
}

export type PensionFundsQuery = {
  getPensionFunds: Array<SelectItem>
}

export type PrivatePensionFundsQuery = {
  getPrivatePensionFunds: Array<SelectItem>
}
