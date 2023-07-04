import { PaymentsDT } from '@island.is/clients/payment-schedule'

export type chargeType = {
  id: string
  name: string
  total: number
  intrest: number
  expenses: number
  principal: number
}

export type PublicDebtPaymentPlanPayment = {
  id: PublicDebtPaymentScheduleType
  totalAmount: number
  distribution: PaymentsDT[]
  amountPerMonth: number
  numberOfMonths: number
  organization: string
  chargetypes: chargeType[]
}

export type PublicDebtPaymentPlanPaymentCollection = {
  [key: string]: PublicDebtPaymentPlanPayment
}

export type PublicDebtPaymentPlanPrerequisites = {
  type: PublicDebtPaymentScheduleType
  organizationId: string
  chargetypes: chargeType[]
}

export enum PublicDebtPaymentScheduleType {
  FinesAndLegalCost = 'FinesAndLegalCost',
  OverpaidBenefits = 'OverpaidBenefits',
  Wagedection = 'Wagedection',
  OtherFees = 'OtherFees',
}
