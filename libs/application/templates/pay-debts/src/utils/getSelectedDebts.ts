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

export const getSelectedDebts = (application: Application): SelectedDebt[] => {
  const selectedFlags =
    getValueViaPath<boolean[]>(application.answers, 'selectedDebts') ?? []
  const payIds =
    getValueViaPath<string[]>(application.answers, 'selectedDebtIds') ?? []
  const amountsToPay =
    getValueViaPath<string[]>(application.answers, 'debtsToPay') ?? []

  const amountByPayId = new Map<string, string | undefined>()
  payIds.forEach((payId, index) => {
    if (selectedFlags[index]) {
      amountByPayId.set(payId, amountsToPay[index])
    }
  })

  return getDebts(application).reduce<SelectedDebt[]>((selected, debt) => {
    if (!amountByPayId.has(debt.payID)) {
      return selected
    }

    selected.push({ ...debt, amountToPay: debt.debts })

    return selected
  }, [])
}
