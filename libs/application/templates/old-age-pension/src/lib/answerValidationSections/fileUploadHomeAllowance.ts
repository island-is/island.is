import { Application, Answer } from '@island.is/application/types'

import isEmpty from 'lodash/isEmpty'

import { validatorErrorMessages } from '../messages'
import { getApplicationAnswers } from '../oldAgePensionUtils'
import {
  AnswerValidationConstants,
  HomeAllowanceHousing,
  YES,
} from '../constants'
import { buildError } from './utils'

export const fileUploadHomeAllowance = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOADHOMEALLOWANCE } = AnswerValidationConstants

  const { homeAllowanceChildren, homeAllowanceHousing } = getApplicationAnswers(
    application.answers,
  )
  if (homeAllowanceChildren === YES && obj.schoolConfirmation) {
    if (
      isEmpty((obj as { schoolConfirmation: unknown[] }).schoolConfirmation)
    ) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADHOMEALLOWANCE}.schoolConfirmation`,
      )
    }
  }

  if (
    homeAllowanceHousing === HomeAllowanceHousing.RENTER &&
    obj.leaseAgreement
  ) {
    if (isEmpty((obj as { leaseAgreement: unknown[] }).leaseAgreement)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADHOMEALLOWANCE}.leaseAgreement`,
      )
    }
  }

  return undefined
}
