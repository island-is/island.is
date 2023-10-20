import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { validatorErrorMessages } from '../messages'
import {
  AnswerValidationConstants,
  employeeRatio,
  RatioType,
} from '../constants'
import { buildError, getTotalRatio } from './utils'
import { Employer } from '../../types'
import { filterValidEmployers } from '../oldAgePensionUtils'

export const validateLastestEmployer = (newAnswer: unknown) => {
  const rawEmployers = newAnswer as Employer[] | undefined
  const { VALIDATE_LATEST_EMPLOYER } = AnswerValidationConstants

  if (!Array.isArray(rawEmployers)) {
    return buildError(
      validatorErrorMessages.employersNotAList,
      `${VALIDATE_LATEST_EMPLOYER}`,
    )
  }

  const i = rawEmployers.length - 1
  if (i < 0) {
    return undefined
  }
  const employer = rawEmployers[i]
  const otherEmployers = rawEmployers.slice(0, i)
  const validOtherEmployers = filterValidEmployers(otherEmployers)

  if (!employer.email) {
    return buildError(
      validatorErrorMessages.employerEmailMissing,
      `${VALIDATE_LATEST_EMPLOYER}[${i}].email`,
    )
  }
  if (rawEmployers.findIndex((item) => item.email === employer.email) !== i) {
    return buildError(
      validatorErrorMessages.employerEmailDuplicate,
      `${VALIDATE_LATEST_EMPLOYER}[${i}].email`,
    )
  }

  if (
    !employer.ratioType ||
    ![RatioType.MONTHLY, RatioType.YEARLY].includes(employer.ratioType)
  ) {
    return buildError(
      validatorErrorMessages.employerRatioTypeMissing,
      `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioType`,
    )
  }

  if (employer.phoneNumber) {
    const phoneNumber = parsePhoneNumberFromString(employer.phoneNumber, 'IS')
    const phoneNumberStartStr = ['6', '7', '8']
    const checkPhoneNumber =
      phoneNumber &&
      phoneNumber.isValid() &&
      phoneNumberStartStr.some((substr) =>
        phoneNumber.nationalNumber.startsWith(substr),
      )
    if (!checkPhoneNumber) {
      return buildError(
        validatorErrorMessages.employersPhoneNumberInvalid,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].phoneNumber`,
      )
    }
  }

  if (employer.ratioType === RatioType.YEARLY) {
    if (!employer.ratioYearly) {
      return buildError(
        validatorErrorMessages.employerRatioMissing,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioYearly`,
      )
    }

    const employeeRate = +employer.ratioYearly.replace('%', '')
    if (employeeRate > employeeRatio) {
      return buildError(
        validatorErrorMessages.employersRatioMoreThan50,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioYearly`,
      )
    }
    if (employeeRate <= 0) {
      return buildError(
        validatorErrorMessages.employersRatioLessThan0,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioYearly`,
      )
    }

    const totalRatio = getTotalRatio(validOtherEmployers)
    if (employeeRate + totalRatio > employeeRatio) {
      return buildError(
        validatorErrorMessages.totalEmployersRatioMoreThan50,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioYearly`,
      )
    }
  }

  if (employer.ratioType === RatioType.MONTHLY) {
    if (!employer.ratioMonthlyAvg) {
      return buildError(
        validatorErrorMessages.employerRatioMissing,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioMonthlyAvg`,
      )
    }

    const employeeRate = +employer.ratioMonthlyAvg.replace('%', '')
    if (employeeRate > employeeRatio) {
      return buildError(
        validatorErrorMessages.employersRatioMoreThan50,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioMonthlyAvg`,
      )
    }
    if (employeeRate <= 0) {
      return buildError(
        validatorErrorMessages.employersRatioLessThan0,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioMonthlyAvg`,
      )
    }

    const totalRatio = getTotalRatio(validOtherEmployers)
    if (employeeRate + totalRatio > employeeRatio) {
      return buildError(
        validatorErrorMessages.totalEmployersRatioMoreThan50,
        `${VALIDATE_LATEST_EMPLOYER}[${i}].ratioMonthlyAvg`,
      )
    }
  }

  return undefined
}
