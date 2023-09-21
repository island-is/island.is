import { Application, Answer } from '@island.is/application/types'
import isEmpty from 'lodash/isEmpty'
import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants } from '../constants'
import { buildError } from './utils'
import { getApplicationAnswers } from '../childPensionUtils'

export const fileUploadValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOAD } = AnswerValidationConstants

  const { registeredChildren } = getApplicationAnswers(application.answers)

  if (registeredChildren.length > 0 && obj.maintenance) {
    if (isEmpty((obj as { maintenance: unknown[] }).maintenance)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOAD}.maintenance`,
      )
    }
  }

  return undefined
}
