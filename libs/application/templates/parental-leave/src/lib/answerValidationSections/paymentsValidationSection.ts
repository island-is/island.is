import { Application } from '@island.is/application/types'
import { Payments } from '../../types'
import { getApplicationAnswers } from '../parentalLeaveUtils'
import {
  AnswerValidationConstants,
  NO,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  PARENTAL_LEAVE,
  YES,
} from '../../constants'
import { buildError } from './utils'
import { coreErrorMessages } from '@island.is/application/core'
const { PAYMENTS } = AnswerValidationConstants

export const paymentsValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const payments = newAnswer as Payments

  const {
    applicationType,
    privatePensionFund,
    privatePensionFundPercentage,
    usePrivatePensionFund,
  } = getApplicationAnswers(application.answers)

  if (applicationType === PARENTAL_LEAVE) {
    if (!payments.pensionFund) {
      return buildError(coreErrorMessages.defaultError, 'pensionFund', PAYMENTS)
    }

    if (payments.union !== NO_UNION) {
      if (payments.union === '') {
        return buildError(coreErrorMessages.defaultError, 'union', PAYMENTS)
      }
    }

    // if privatePensionFund is NO_PRIVATE_PENSION_FUND and privatePensionFundPercentage is an empty string, allow the user to continue.
    // this will only happen when the usePrivatePensionFund field is set to NO
    if (
      payments.privatePensionFund === NO_PRIVATE_PENSION_FUND &&
      (payments.privatePensionFundPercentage === '0' ||
        payments.privatePensionFundPercentage === undefined)
    )
      return undefined

    if (usePrivatePensionFund === NO || usePrivatePensionFund === YES) {
      if (payments.privatePensionFund === '') {
        return buildError(
          coreErrorMessages.defaultError,
          'privatePensionFund',
          PAYMENTS,
        )
      }
      if (payments.privatePensionFundPercentage === '') {
        return buildError(
          coreErrorMessages.defaultError,
          'privatePensionFundPercentage',
          PAYMENTS,
        )
      }
    }

    if (
      payments.privatePensionFund === '' ||
      payments.privatePensionFund === NO_PRIVATE_PENSION_FUND
    ) {
      return buildError(
        coreErrorMessages.defaultError,
        'privatePensionFund',
        PAYMENTS,
      )
    }

    // This case will only happen if the users has first selected NO
    // and then goes back and changes to YES without filling in data for pritvatePensionFundPercentage
    if (
      privatePensionFund === NO_PRIVATE_PENSION_FUND &&
      privatePensionFundPercentage === '0' &&
      payments.privatePensionFundPercentage === ''
    ) {
      return buildError(
        coreErrorMessages.defaultError,
        'privatePensionFundPercentage',
        PAYMENTS,
      )
    }

    if (
      payments.privatePensionFundPercentage !== '2' &&
      payments.privatePensionFundPercentage !== '4'
    ) {
      if (usePrivatePensionFund === NO) return undefined
      return buildError(
        coreErrorMessages.defaultError,
        'privatePensionFundPercentage',
        PAYMENTS,
      )
    }

    // validate that the privatePensionFundPercentage is either 2 or 4 percent
    if (
      payments.privatePensionFundPercentage === '2' ||
      payments.privatePensionFundPercentage === '4'
    ) {
      return undefined
    }
  }

  return undefined
}
