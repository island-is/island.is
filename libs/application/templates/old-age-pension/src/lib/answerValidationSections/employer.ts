import { Application, Answer } from '@island.is/application/types'

import { validatorErrorMessages } from '../messages'
import { getApplicationAnswers } from '../oldAgePensionUtils'
import { AnswerValidationConstants, Employment } from '../constants'
import { buildError } from './utils'

import isEmpty from 'lodash/isEmpty'

export const employer = (newAnswer: unknown, application: Application) => {
  const obj = newAnswer as Record<string, Answer>
  const { EMPLOYER } = AnswerValidationConstants

  const { employment } = getApplicationAnswers(application.answers)

  if (
    !(
      obj.employment === Employment.SELFEMPLOYED ||
      obj.employment === Employment.EMPLOYEE
    )
  ) {
    return buildError(
      validatorErrorMessages.requireAnswer,
      `${EMPLOYER}.employment`,
    )
  }

  if (obj.selfEmployedAttachment && employment === Employment.SELFEMPLOYED) {
    if (
      isEmpty(
        (obj as { selfEmployedAttachment: unknown[] }).selfEmployedAttachment,
      )
    ) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${EMPLOYER}.selfEmployedAttachment`,
      )
    }
  }

  return undefined
}
