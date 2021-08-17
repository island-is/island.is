export interface ApplicationResult {
  name: string
  nationalId: string
  address: string
  city: string
  postalCode: string
  email: string
  phone: string

  status: string /** Aðstæður umsækjanda */

  applicationDate: Date
  taxDiscount: number
  taxCardRatio: number
  monthlyIncome: number
  pensionFundsIncome: number
  insuranceIncome: number
  taxStep1: number
  taxStep2: number
  additionalPensionFundsRatio: number
  workersUnionRatio: number
  jobRatio: number
  pensionFundsRatio: number
  parentalLeave: boolean
  unEmploymentBase: number
  numberOfChildren: number
}
