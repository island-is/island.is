import { MessageDescriptor } from '@formatjs/intl'
import { Application } from '@island.is/application/types'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../parentalLeaveUtils'
import { buildError, validatePeriodResidenceGrant } from './utils'

interface ResidenceGrantObject {
  dateTo: string
  dateFrom: string
}

export const residenceGrantValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const { dateOfBirth } = application.answers
  const { children } = getApplicationExternalData(application.externalData)
  const { hasMultipleBirths } = getApplicationAnswers(application.answers)

  const inputAnswer = newAnswer as ResidenceGrantObject

  const result: {
    field: string | undefined
    error: MessageDescriptor | undefined
  } = validatePeriodResidenceGrant(
    `${dateOfBirth}`,
    `${children[0].expectedDateOfBirth}`,
    hasMultipleBirths,
    inputAnswer.dateFrom,
    inputAnswer.dateTo,
  )
  if (result.field) {
    const field = 'residenceGrant.'.concat(result?.field || '')
    const error = result.error || ''
    return buildError(error, field)
  }
  return undefined
}
