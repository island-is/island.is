import { Application, Answer } from '@island.is/application/types'

import isEmpty from 'lodash/isEmpty'

import { validatorErrorMessages } from '../messages'
import { getApplicationAnswers } from '../oldAgePensionUtils'
import {
  AnswerValidationConstants,
  HouseholdSupplementHousing,
  YES,
} from '../constants'
import { buildError } from './utils'

export const fileUploadHouseholdSupplement = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOADHOUSEHOLDSUPPLEMENT } = AnswerValidationConstants

  const { householdSupplementChildren, householdSupplementHousing } =
    getApplicationAnswers(application.answers)
  if (householdSupplementChildren === YES && obj.schoolConfirmation) {
    if (
      isEmpty((obj as { schoolConfirmation: unknown[] }).schoolConfirmation)
    ) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADHOUSEHOLDSUPPLEMENT}.schoolConfirmation`,
      )
    }
  }

  if (
    householdSupplementHousing === HouseholdSupplementHousing.RENTER &&
    obj.leaseAgreement
  ) {
    if (isEmpty((obj as { leaseAgreement: unknown[] }).leaseAgreement)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADHOUSEHOLDSUPPLEMENT}.leaseAgreement`,
      )
    }
  }

  return undefined
}
