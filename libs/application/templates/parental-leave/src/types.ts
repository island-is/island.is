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

// TODO: Confirm if these types are generated out of the vmst-client through openapi.
// https://github.com/island-is/island.is/pull/3161#discussion_r590334125
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
