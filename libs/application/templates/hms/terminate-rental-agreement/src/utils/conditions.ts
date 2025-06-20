import { ExternalData, FormValue } from '@island.is/application/types'
import { TerminationTypes } from './constants'
import { getValueViaPath } from '@island.is/application/core'
import { isTerminationBound } from './helpers'

export const isTermination = (answers: FormValue) => {
  const terminationType = getValueViaPath<string>(
    answers,
    'terminationType.answer',
  )
  return terminationType === TerminationTypes.TERMINATION
}

export const isCancelation = (answers: FormValue) => {
  const terminationType = getValueViaPath<string>(
    answers,
    'terminationType.answer',
  )
  return terminationType === TerminationTypes.CANCELATION
}

export const isBoundTermination = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  return isTermination(answers) && isTerminationBound(answers, externalData)
}

export const isUnboundTermination = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  return isTermination(answers) && !isTerminationBound(answers, externalData)
}
