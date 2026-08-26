import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { CustomerDebt } from './types'
import { getDebts } from './getDebts'

export const getSelectedDebts = (application: Application): CustomerDebt[] => {
  const debts = getDebts(application)

  const selectedFlags =
    getValueViaPath<boolean[]>(application.answers, 'selectedDebts') ?? []

  return debts.filter((_, index) => !!selectedFlags[index])
}
