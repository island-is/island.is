import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionType } from '../../shared'

export const getExemptionType = (
  answers: FormValue,
): ExemptionType | undefined => {
  return getValueViaPath<ExemptionType>(answers, 'exemptionPeriod.type')
}

export const checkIfExemptionTypeShortTerm = (answers: FormValue): boolean => {
  return getExemptionType(answers) === ExemptionType.SHORT_TERM
}

export const checkIfExemptionTypeLongTerm = (answers: FormValue): boolean => {
  return getExemptionType(answers) === ExemptionType.LONG_TERM
}
