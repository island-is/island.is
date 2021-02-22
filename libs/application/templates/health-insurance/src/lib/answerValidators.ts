import isNumber from 'lodash/isNumber'
import {
  Application,
  AnswerValidator,
  AnswerValidationError,
} from '@island.is/application/core'
import { StatusTypes, Status } from '../types'
import { NO, YES } from '../constants'

const buildValidationError = (
  path: string,
  index?: number,
): ((message: string, field?: string) => AnswerValidationError) => (
  message,
  field,
) => {
  if (field && isNumber(index)) {
    return {
      message,
      path: `${path}[${index}].${field}`,
    }
  }

  return {
    message,
    path,
  }
}

const STATUS = 'status'
const FORMER_INSURANCE = 'formerInsurance'

// TODO: Add translation messages here
export const answerValidators: Record<string, AnswerValidator> = {
  [STATUS]: (newAnswer: unknown, application: Application) => {
    const buildError = buildValidationError(`${STATUS}.type`)
    const status = newAnswer as Status

    if (!Object.values(StatusTypes).includes(status.type)) {
      return buildError('You must select one of the above', `${STATUS}.type`)
    }
    if (
      status.type === StatusTypes.STUDENT &&
      !status.confirmationOfStudies.length
    ) {
      return buildError(
        'Please attach a confirmation of studies below',
        `${STATUS}.type`,
      )
    }

    return undefined
  },
  [FORMER_INSURANCE]: (newAnswer: unknown, application: Application) => {
    const formerInsurance = newAnswer as any //TODO: create FormerInsurance

    // Check registration is Yes / No
    if (
      formerInsurance.registration !== YES &&
      formerInsurance.registration !== NO
    ) {
      const buildError = buildValidationError(
        `${FORMER_INSURANCE}.registration`,
      )
      return buildError(
        'You must select one of the above',
        `${FORMER_INSURANCE}.registration`,
      )
    }

    // Check country is a string and not empty

    // Check national ID is string and not empty

    // Check entitlement is Yes / No if !requireWaitingPeriod

    // Check entitelmentReason is a string and not empty if entitlement === YES

    return undefined
  },
}
