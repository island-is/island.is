import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { SelectedDebt } from './types'
import { getDebts } from './getDebts'

export const getSelectedDebts = (application: Application): SelectedDebt[] => {
  const debts = getDebts(application)

  const selectedFlags =
    getValueViaPath<boolean[]>(application.answers, 'selectedDebts') ?? []
  const amountsToPay =
    getValueViaPath<string[]>(application.answers, 'debtsToPay') ?? []

  return debts.reduce<SelectedDebt[]>((selected, debt, index) => {
    if (!selectedFlags[index]) {
      return selected
    }

    const amountToPay = parseInt(amountsToPay[index], 10)

    selected.push({
      ...debt,
      amountToPay: Number.isNaN(amountToPay) ? debt.debts : amountToPay,
    })

    return selected
  }, [])
}
