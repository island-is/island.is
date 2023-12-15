import {
  AnswerValidator,
  getValueViaPath,
  buildValidationError,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Status, FormerInsurance } from '../types'
import { NO, YES, StatusTypes } from '../shared'
import {
  requireConfirmationOfResidency,
  requireWaitingPeriod,
} from '../healthInsuranceUtils'

const STATUS = 'status'
const FORMER_INSURANCE = 'formerInsurance'

// TODO: Add translation messages here
export const answerValidators: Record<string, AnswerValidator> = {
  [STATUS]: (newAnswer: unknown, _application: Application) => {
    const status = newAnswer as Status

    if (!Object.values(StatusTypes).includes(status.type)) {
      const field = `${STATUS}.type`
      const buildError = buildValidationError(field)
      return buildError('You must select one of the above', field)
    }
    if (
      status.type === StatusTypes.STUDENT &&
      !status.confirmationOfStudies.length
    ) {
      const field = `${STATUS}.confirmationOfStudies`
      const buildError = buildValidationError(field)
      return buildError('Please attach a confirmation of studies', field)
    }

    return undefined
  },
  [FORMER_INSURANCE]: (newAnswer: unknown, application: Application) => {
    const formerInsurance = newAnswer as FormerInsurance
    const {
      registration,
      country,
      personalId,
      confirmationOfResidencyDocument,
      entitlement,
      entitlementReason,
    } = formerInsurance

    const citizenship = getValueViaPath(
      application.answers,
      'citizenship',
    ) as string

    /* Registration must be Yes / No */
    if (registration !== YES && registration !== NO) {
      const field = `${FORMER_INSURANCE}.registration`
      const buildError = buildValidationError(field)
      return buildError('You must select one of the above', field)
    }

    if (!requireWaitingPeriod(country, citizenship)) {
      const personalIdField = `${FORMER_INSURANCE}.personalId`

      if (personalId) {
        /* Check that personal ID in former country length is as specified in Sjukra's api */
        if (personalId.length < 6) {
          const buildError = buildValidationError(personalIdField)
          return buildError('Should be at least 6 characters', personalIdField)
        } else if (personalId.length > 20) {
          const buildError = buildValidationError(personalIdField)
          return buildError(
            'Should be at most 20 characters long',
            personalIdField,
          )
        }
      } else {
        /* Check that personal ID is not empty */
        const buildError = buildValidationError(personalIdField)
        return buildError(
          'Please fill in your ID number in previous country',
          personalIdField,
        )
      }
      /* Check file upload if country is Greenland / Faroe */
      if (
        requireConfirmationOfResidency(country) &&
        !confirmationOfResidencyDocument.length
      ) {
        const field = `${FORMER_INSURANCE}.confirmationOfResidencyDocument`
        const buildError = buildValidationError(field)
        return buildError('Please attach a confirmation of residency', field)
      }
      /* Check that entitlement is Yes / No */
      if (entitlement !== YES && entitlement !== NO) {
        const field = `${FORMER_INSURANCE}.entitlement`
        const buildError = buildValidationError(field)
        return buildError('You must select one of the above', field)
      }
      /* Check that entitelmentReason is not empty if field is rendered (rendered if entitlement === YES) */
      if (entitlement === YES && !entitlementReason) {
        const field = `${FORMER_INSURANCE}.entitlementReason`
        const buildError = buildValidationError(field)
        return buildError('Please fill in a reason', field)
      }
    } else {
      /* User that requires waiting period, should not be allowed to continue */
      const buildError = buildValidationError(`${FORMER_INSURANCE}`)
      return buildError('User needs to wait for the waiting period')
    }

    return undefined
  },
}
