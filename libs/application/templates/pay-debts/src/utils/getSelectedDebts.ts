import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { CustomerDebt } from './types'
import { getDebts } from './getDebts'

export const getSelectedDebts = (application: Application): CustomerDebt[] => {
  const debts = getDebts(application)

  const selectedIndexes =
    getValueViaPath<number[]>(application.answers, 'selectedDebts') ?? []

  return selectedIndexes
    .map((index) => debts[index])
    .filter((debt): debt is CustomerDebt => !!debt)
}
