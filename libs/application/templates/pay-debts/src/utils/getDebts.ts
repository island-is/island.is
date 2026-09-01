import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { CustomerDebt } from './types'

export const DEBTS_EXTERNAL_DATA_ID = 'customerDebts'

export const DEBTS_MAX_AGE_MS = 60 * 60 * 1000

export const hasFetchedDebts = (externalData: ExternalData): boolean =>
  externalData?.[DEBTS_EXTERNAL_DATA_ID]?.status === 'success'

export const debtsAreStale = (externalData: ExternalData): boolean => {
  const result = externalData?.[DEBTS_EXTERNAL_DATA_ID]

  if (result?.status !== 'success') {
    return true
  }

  const fetchedAt = result.date ? new Date(result.date).getTime() : Number.NaN

  if (Number.isNaN(fetchedAt)) {
    return true
  }

  return Date.now() - fetchedAt > DEBTS_MAX_AGE_MS
}

export const getDebtsFromExternalData = (
  externalData: ExternalData,
): CustomerDebt[] =>
  getValueViaPath<CustomerDebt[]>(
    externalData,
    `${DEBTS_EXTERNAL_DATA_ID}.data.debts`,
  ) ?? []

export const getDebts = (application: Application): CustomerDebt[] =>
  getDebtsFromExternalData(application.externalData)

export const debtsSignature = (debts: CustomerDebt[]): string =>
  debts
    .map((debt) =>
      [
        debt.chargeTypeId,
        debt.chargeItemSubject,
        debt.dueDate,
        debt.debts,
      ].join(':'),
    )
    .join('|')
