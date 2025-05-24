import { getValueViaPath } from '@island.is/application/core'
import { SelfOrOthers } from './enums'
import { FormValue } from '@island.is/application/types'

export const isSelfPath = (answers: FormValue): boolean => {
  const selfOrOthers = getValueViaPath<SelfOrOthers>(
    answers,
    'information.selfOrOthers',
  )
  return selfOrOthers === SelfOrOthers.self
}

export const isOthersPath = (answers: FormValue): boolean => {
  const selfOrOthers = getValueViaPath<SelfOrOthers>(
    answers,
    'information.selfOrOthers',
  )
  return selfOrOthers === SelfOrOthers.others
}
