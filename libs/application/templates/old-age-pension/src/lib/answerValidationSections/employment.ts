import { Application, Answer } from '@island.is/application/types'

import { validatorErrorMessages } from '../messages'
import { getApplicationAnswers } from '../oldAgePensionUtils'
import { AnswerValidationConstants, Employment } from '../constants'
import { buildError } from './utils'

import isEmpty from 'lodash/isEmpty'

export const employment = (newAnswer: unknown, application: Application) => {
  const obj = newAnswer as Record<string, Answer>
  const { EMPLOYMENT } = AnswerValidationConstants

  const { employmentStatus } = getApplicationAnswers(application.answers)

  if (
    obj.selfEmployedAttachment &&
    employmentStatus === Employment.SELFEMPLOYED
  ) {
    if (
      isEmpty(
        (obj as { selfEmployedAttachment: unknown[] }).selfEmployedAttachment,
      )
    ) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${EMPLOYMENT}.selfEmployedAttachment`,
      )
    }
  }

  return undefined
}
