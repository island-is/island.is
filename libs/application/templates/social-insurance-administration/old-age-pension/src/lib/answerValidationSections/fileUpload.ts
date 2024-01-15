import { Application, Answer } from '@island.is/application/types'

import * as kennitala from 'kennitala'
import isEmpty from 'lodash/isEmpty'

import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getAgeBetweenTwoDates,
  getApplicationAnswers,
} from '../oldAgePensionUtils'
import {
  AnswerValidationConstants,
  earlyRetirementMaxAge,
  earlyRetirementMinAge,
} from '../constants'
import { MONTHS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { buildError } from './utils'

export const fileUpload = (newAnswer: unknown, application: Application) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOAD } = AnswerValidationConstants

  const { selectedMonth, selectedYear } =
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

  if (
    age >= earlyRetirementMinAge &&
    age <= earlyRetirementMaxAge &&
    obj.earlyRetirement
  ) {
    if (isEmpty((obj as { earlyRetirement: unknown[] }).earlyRetirement)) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.earlyRetirement`,
      )
    }
  }

  return undefined
}
