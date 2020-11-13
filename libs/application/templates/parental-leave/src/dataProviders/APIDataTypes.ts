export type Union = {
  id: number
  name: string
}
export type PensionFund = {
  id: string
  name: string
}

export type Period = {
  from: string
  to: string
  ratio: number
  approved: boolean
  paid: boolean
}

export type Employer = {
  email: string
  nationalRegistryId: string
}

export type PregnancyStatus = {
  hasActivePregnancy: boolean
  pregnancyDueDate?: string
}

export type Rights = {
  independentMonths: number
  transferableMonths: number
}
export type PaymentInfo = {
  bankAccount: string
  personalAllowance: number
  personalAllowanceFromSpouse: number
  union: Union
  pensionFund: PensionFund
  privatePensionFund?: PensionFund
  privatePensionFundRatio?: number
}
export type PaymentPlan = {
  period: Period
  estimatedAmount: number
  pensionAmount: number
  privatePensionAmount: number
  unionAmount: number
  taxAmount: number
  estimatePayment: number
}
export type ParentalLeave = {
  applicationId: string
  applicant: string
  otherParentId: string
  expectedDateOfBirth: string
  dateOfBirth?: string
  email: string
  phoneNumber: string
  paymentInfo: PaymentInfo
  periods: Period[]
  employers: Employer[]
  status: string // this should probably be an enum...
}
