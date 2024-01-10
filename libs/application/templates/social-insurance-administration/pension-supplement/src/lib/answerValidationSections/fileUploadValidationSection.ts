import { Answer, Application } from '@island.is/application/types'
import isEmpty from 'lodash/isEmpty'
import { AnswerValidationConstants, ApplicationReason } from '../constants'
import { getApplicationAnswers } from '../pensionSupplementUtils'
import { buildError } from './utils'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const fileUploadValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOAD } = AnswerValidationConstants
  const { applicationReason } = getApplicationAnswers(application.answers)

  if (
    applicationReason.includes(ApplicationReason.ASSISTED_CARE_AT_HOME) &&
    obj.assistedCareAtHome
  ) {
    if (
      isEmpty((obj as { assistedCareAtHome: unknown[] }).assistedCareAtHome)
    ) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.assistedCareAtHome`,
      )
    }
  }

  if (
    applicationReason.includes(ApplicationReason.HOUSE_RENT) &&
    obj.houseRentAgreement
  ) {
    if (
      isEmpty((obj as { houseRentAgreement: unknown[] }).houseRentAgreement)
    ) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.houseRentAgreement`,
      )
    }
  }

  if (
    applicationReason.includes(ApplicationReason.HOUSE_RENT) &&
    obj.houseRentAllowance
  ) {
    if (
      isEmpty((obj as { houseRentAllowance: unknown[] }).houseRentAllowance)
    ) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.houseRentAllowance`,
      )
    }
  }

  if (
    applicationReason.includes(ApplicationReason.ASSISTED_LIVING) &&
    obj.assistedLiving
  ) {
    if (isEmpty((obj as { assistedLiving: unknown[] }).assistedLiving)) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.assistedLiving`,
      )
    }
  }

  if (
    applicationReason.includes(ApplicationReason.HELPING_EQUIPMENT) &&
    obj.purchaseOfHearingAids
  ) {
    if (
      isEmpty(
        (obj as { purchaseOfHearingAids: unknown[] }).purchaseOfHearingAids,
      )
    ) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.purchaseOfHearingAids`,
      )
    }
  }

  if (
    applicationReason.includes(ApplicationReason.HALFWAY_HOUSE) &&
    obj.halfwayHouse
  ) {
    if (isEmpty((obj as { halfwayHouse: unknown[] }).halfwayHouse)) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.halfwayHouse`,
      )
    }
  }

  return undefined
}
