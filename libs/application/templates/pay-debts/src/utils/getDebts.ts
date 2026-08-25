import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { CustomerDebt } from './types'

export const getDebts = (application: Application): CustomerDebt[] =>
  getValueViaPath<CustomerDebt[]>(
    application.externalData,
    'customerDebts.data.debts',
  ) ?? []
