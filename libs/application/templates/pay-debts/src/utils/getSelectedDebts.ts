import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { CustomerDebt, SelectedDebt } from './types'
import { getDebts } from './getDebts'

export const getAmountToPay = (
  debt: CustomerDebt,
  typedAmount: string | undefined,
): number => {
  const amount = parseInt(typedAmount ?? '', 10)

  return Number.isNaN(amount)
    ? debt.debts
    : Math.min(Math.max(amount, 1), debt.debts)
}

export const pickSelectedDebts = (
  debts: CustomerDebt[],
  selectedFlags?: boolean[],
  payIds?: string[],
): SelectedDebt[] => {
  const selectedPayIds = new Set(
    (payIds ?? []).filter((_payId, index) => selectedFlags?.[index]),
  )

  return debts
    .filter((debt) => selectedPayIds.has(debt.payID))
    .map((debt) => ({ ...debt, amountToPay: debt.debts }))
}

export const getSelectedDebts = (application: Application): SelectedDebt[] =>
  pickSelectedDebts(
    getDebts(application),
    getValueViaPath<boolean[]>(application.answers, 'selectedDebts'),
    getValueViaPath<string[]>(application.answers, 'selectedDebtIds'),
  )

export const getDebtPaymentItems = (application: Application) =>
  getSelectedDebts(application).map((debt) => ({
    payId: debt.payID,
    amount: debt.amountToPay,
    label: `${debt.chargeTypeName} - ${debt.chargeItemSubject}`.slice(0, 255),
  }))
