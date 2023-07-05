import { Application, Answer } from '@island.is/application/types'

import { validatorErrorMessages } from '../messages'
import { getApplicationAnswers } from '../oldAgePensionUtils'
import { AnswerValidationConstants, Employment } from '../constants'
import { buildError } from './utils'

import isEmpty from 'lodash/isEmpty'

export const employers = (newAnswer: unknown, application: Application) => {
  const obj = newAnswer as Record<string, Answer>
  const { EMPLOYERS } = AnswerValidationConstants

  const { employers } = getApplicationAnswers(application.answers)

  if (employers.length === 0) {
    return buildError(validatorErrorMessages.requireAttachment, `${EMPLOYERS}`)
  }

  return undefined
}
