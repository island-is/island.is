import { Application, Answer } from '@island.is/application/types'

import * as kennitala from 'kennitala'
import isEmpty from 'lodash/isEmpty'

import { validatorErrorMessages } from '../messages'
import {
  getAgeBetweenTwoDates,
  getApplicationAnswers,
} from '../oldAgePensionUtils'
import {
  AnswerValidationConstants,
  ApplicationType,
  earlyRetirementMaxAge,
  earlyRetirementMinAge,
  MONTHS,
} from '../constants'
import { buildError } from './utils'

export const fileUpload = (newAnswer: unknown, application: Application) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOAD } = AnswerValidationConstants

  const { selectedMonth, selectedYear, applicationType } =
    getApplicationAnswers(application.answers)
  const dateOfBirth = kennitala.info(application.applicant).birthday

  const dateOfBirth00 = new Date(
    dateOfBirth.getFullYear(),
    dateOfBirth.getMonth(),
  )

  const selectedDate = new Date(
    +selectedYear,
    MONTHS.findIndex((x) => x.value === selectedMonth),
  )

  const age = getAgeBetweenTwoDates(selectedDate, dateOfBirth00)

  if (obj.pension) {
    if (isEmpty((obj as { pension: unknown[] }).pension)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOAD}.pension`,
      )
    }
  }

  if (
    age >= earlyRetirementMinAge &&
    age <= earlyRetirementMaxAge &&
    obj.earlyRetirement
  ) {
    if (isEmpty((obj as { earlyRetirement: unknown[] }).earlyRetirement)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOAD}.earlyRetirement`,
      )
    }
  }

  if (applicationType === ApplicationType.SAILOR_PENSION && obj.fishermen) {
    if (isEmpty((obj as { fishermen: unknown[] }).fishermen)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOAD}.fishermen`,
      )
    }
  }

  return undefined
}
