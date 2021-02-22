import isNumber from 'lodash/isNumber'
import {
  Application,
  AnswerValidator,
  AnswerValidationError,
  getValueViaPath,
} from '@island.is/application/core'
import { StatusTypes, Status, FormerInsurance, Applicant } from '../types'
import { NO, YES } from '../constants'
import {
  requireConfirmationOfResidency,
  requireWaitingPeriod,
} from '../healthInsuranceUtils'

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
    const field = `${STATUS}.type`
    const buildError = buildValidationError(field)
    const status = newAnswer as Status

    if (!Object.values(StatusTypes).includes(status.type)) {
      return buildError('You must select one of the above', field)
    }
    if (
      status.type === StatusTypes.STUDENT &&
      !status.confirmationOfStudies.length
    ) {
      return buildError('Please attach a confirmation of studies below', field)
    }

    return undefined
  },
  [FORMER_INSURANCE]: (newAnswer: unknown, application: Application) => {
    const formerInsurance = newAnswer as FormerInsurance
    const applicant = getValueViaPath(
      application.answers,
      'applicant',
    ) as Applicant

    // Registration must be Yes / No
    if (
      formerInsurance.registration !== YES &&
      formerInsurance.registration !== NO
    ) {
      const field = `${FORMER_INSURANCE}.registration`
      const buildError = buildValidationError(field)
      return buildError('You must select one of the above', field)
    }

    // Check that country is a string and not empty
    if (!formerInsurance.country) {
      const field = `${FORMER_INSURANCE}.country`
      const buildError = buildValidationError(field)
      return buildError('Please select a country', field)
    }

    // Check file upload if country is Greenland / Faroe
    if (
      requireConfirmationOfResidency(formerInsurance.country) &&
      !formerInsurance.confirmationOfResidencyDocument.length
    ) {
      const field = `${FORMER_INSURANCE}.personalId`
      const buildError = buildValidationError(field)
      return buildError(
        'Please attach a confirmation of residency below',
        field,
      )
    }

    if (
      !requireWaitingPeriod(formerInsurance.country, applicant?.citizenship)
    ) {
      // Check that national ID is string and not empty
      if (!formerInsurance.personalId) {
        const field = `${FORMER_INSURANCE}.personalId`
        const buildError = buildValidationError(field)
        return buildError(
          'Please fill in your ID number in previous country',
          field,
        )
      }
      // Check that entitlement is Yes / No
      if (
        formerInsurance.entitlement !== YES &&
        formerInsurance.entitlement !== NO
      ) {
        const field = `${FORMER_INSURANCE}.entitlement`
        const buildError = buildValidationError(field)
        return buildError('You must select one of the above', field)
      }
      // Check that entitelmentReason is a string and not empty (field is conditionally renderd if entitlement === YES)
      if (
        formerInsurance.entitlement === YES &&
        !formerInsurance.entitlementReason
      ) {
        const field = `${FORMER_INSURANCE}.entitlementReason`
        const buildError = buildValidationError(field)
        return buildError('Please fill in a reason', field)
      }
      // user that requires waiting period, should not be allowed to continue
    } else {
      const buildError = buildValidationError(`${FORMER_INSURANCE}`)
      return buildError('')
    }

    return undefined
  },
}
