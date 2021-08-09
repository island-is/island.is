import { paymentPlanEntryKeys, PublicDebtPaymentPlan } from '../types'

export const getPaymentPlanIds = (
  paymentPlans: PublicDebtPaymentPlan['paymentPlans'] | undefined,
) =>
  paymentPlans
    ? Object.keys(paymentPlans)?.map(
        (key) => paymentPlans[key as keyof typeof paymentPlans]?.id,
      )
    : []

export const getPaymentPlanKeyById = (
  paymentPlans: PublicDebtPaymentPlan['paymentPlans'] | undefined,
  id: string,
) =>
  paymentPlans
    ? Object.keys(paymentPlans)?.find(
        (key) => paymentPlans[key as keyof typeof paymentPlans]?.id === id,
      )
    : null

export const getEmptyPaymentPlanEntryKey = (
  paymentPlans: PublicDebtPaymentPlan['paymentPlans'] | undefined,
) =>
  paymentPlanEntryKeys.find(
    (key) =>
      !paymentPlans ||
      paymentPlans[key as keyof typeof paymentPlans] === undefined,
  )
