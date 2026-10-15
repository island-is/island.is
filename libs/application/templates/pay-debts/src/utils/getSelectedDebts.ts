import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { SelectedDebt } from './types'
import { getDebts } from './getDebts'

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

    const amountToPay = parseInt(amountByPayId.get(debt.payID) ?? '', 10)

    selected.push({
      ...debt,
      amountToPay: Number.isNaN(amountToPay)
        ? debt.debts
        : Math.min(Math.max(amountToPay, 1), debt.debts),
    })

    return selected
  }, [])
}
