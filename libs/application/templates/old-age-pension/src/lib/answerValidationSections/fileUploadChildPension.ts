import { Application, Answer } from '@island.is/application/types'

import isEmpty from 'lodash/isEmpty'

import { validatorErrorMessages } from '../messages'
import {
  childCustodyLivesWithApplicant,
  getApplicationAnswers,
} from '../oldAgePensionUtils'
import { AnswerValidationConstants } from '../constants'
import { buildError } from './utils'

export const fileUploadChildPension = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOADCHILDPENSION } = AnswerValidationConstants

  const { childPension } = getApplicationAnswers(application.answers)

  const DoesNotLiveWithApplicant = childCustodyLivesWithApplicant(
    application.answers,
    application.externalData,
  )

  if (childPension.length > 0 && obj.maintenance) {
    if (isEmpty((obj as { maintenance: unknown[] }).maintenance)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADCHILDPENSION}.maintenance`,
      )
    }
  }

  if (DoesNotLiveWithApplicant && obj.childSupport) {
    if (
      isEmpty(
        (obj as { childSupport: unknown[] }).childSupport,
      )
    ) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADCHILDPENSION}.childSupport`,
      )
    }
  }

  return undefined
}
