import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { CustomerDebt } from './types'

export const getSelectedDebts = (application: Application): CustomerDebt[] => {
  const debts =
    getValueViaPath<CustomerDebt[]>(
      application.externalData,
      'customerDebts.data.debts',
    ) ?? []

  const selectedIndexes =
    getValueViaPath<number[]>(application.answers, 'selectedDebts') ?? []

  return selectedIndexes
    .map((index) => debts[index])
    .filter((debt): debt is CustomerDebt => !!debt)
}
