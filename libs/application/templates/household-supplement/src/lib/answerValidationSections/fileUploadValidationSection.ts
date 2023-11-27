import { Answer, Application } from '@island.is/application/types'
import isEmpty from 'lodash/isEmpty'
import {
  AnswerValidationConstants,
  YES,
  HouseholdSupplementHousing,
} from '../constants'
import { getApplicationAnswers } from '../householdSupplementUtils'
import { buildError } from './utils'
import { validatorErrorMessages } from '../messages'

export const fileUploadValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOAD } = AnswerValidationConstants
  const { householdSupplementHousing, householdSupplementChildren } =
    getApplicationAnswers(application.answers)

  if (householdSupplementChildren === YES && obj.schoolConfirmation) {
    if (
      isEmpty((obj as { schoolConfirmation: unknown[] }).schoolConfirmation)
    ) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOAD}.schoolConfirmation`,
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
        `${FILEUPLOAD}.leaseAgreement`,
      )
    }
  }

  return undefined
}
