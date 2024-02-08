import { Answer, Application } from '@island.is/application/types'
import { getApplicationAnswers } from '../parentalLeaveUtils'
import isEmpty from 'lodash/isEmpty'
import { buildError } from './utils'
import { AnswerValidationConstants, NO, YES } from '../../constants'
import { errorMessages } from '../messages'
import { isValidEmail } from '../isValidEmail'
import { coreErrorMessages } from '@island.is/application/core'
const { EMPLOYER } = AnswerValidationConstants

export const employerValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>

  const { isSelfEmployed } = getApplicationAnswers(application.answers)

  // If the new answer is the `isSelfEmployed` step, it means we didn't enter the email address yet
  if (obj.isSelfEmployed) {
    return undefined
  }

  if (isSelfEmployed === NO && isEmpty(obj?.email)) {
    return buildError(errorMessages.employerEmail, 'email', EMPLOYER)
  }

  if (isSelfEmployed === NO && !isValidEmail(obj.email as string)) {
    return buildError(errorMessages.email, 'email', EMPLOYER)
  }

  if (obj.isSelfEmployed === '' || !obj.isSelfEmployed) {
    if (isSelfEmployed) {
      return undefined
    }
    return buildError(
      coreErrorMessages.defaultError,
      'isSelfEmployed',
      EMPLOYER,
    )
  }

  return undefined
}
