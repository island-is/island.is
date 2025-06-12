import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export * from './checkHasAnyCustodians'
export * from './format'
export * from './getDate'
export * from './hasDuplicates'
export * from './checkIsEditable'
export * from './checkUseAnswersCopy'
export * from './checkIsFreshman'
export * from './checkIsActor'
export * from './getSchoolsData'

export const applicationDataHasBeenPruned = (answers: FormValue) => {
  return !getValueViaPath<boolean>(answers, 'approveExternalData')
}
