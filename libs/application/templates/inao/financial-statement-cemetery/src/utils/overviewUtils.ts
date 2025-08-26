import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

export const showInfoAlertInOverview = (answers: FormValue) => {
  const totalIncome = getValueViaPath<string>(answers, 'cemeteryIncome.total')
  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    'cemeteryAsset.fixedAssetsTotal',
  )
  const longTerm = getValueViaPath<string>(
    answers,
    'cemeteryLiability.longTerm',
  )
  const incomeLimit =
    getValueViaPath<string>(answers, 'cemeteryOperations.incomeLimit') ?? '0'

  return (
    Number(totalIncome) < Number(incomeLimit) &&
    fixedAssetsTotal === '0' &&
    longTerm === '0'
  )
}
