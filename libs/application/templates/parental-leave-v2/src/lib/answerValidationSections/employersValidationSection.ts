import { NO, YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
} from '../../constants'
import { EmployerRow } from '../../types'
import { errorMessages, parentalLeaveFormMessages } from '../messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../parentalLeaveUtils'
import { buildError } from './utils'

/**
 * A row prefilled from VMST may leave the ratio empty, because VMST doesn't
 * send one. `isFromVMST` is an answer the applicant can write, so only rows
 * VMST really lists get that exception.
 */
const findUnverifiedVMSTRow = (
  rows: EmployerRow[],
  application: Application,
) => {
  const { VMSTApplicationInformation } = getApplicationExternalData(
    application.externalData,
  )
  const vmstEmployers = VMSTApplicationInformation?.employers ?? []

  return rows.findIndex(
    (row) =>
      row?.isFromVMST === true &&
      row.ratio === '' &&
      !vmstEmployers.some(
        (employer) =>
          (!!employer.email && employer.email === row.email) ||
          (!!employer.nationalRegistryId &&
            employer.nationalRegistryId === row.companyNationalRegistryId),
      ),
  )
}

/**
 * The employers table can be left empty in the browser, but an applicant who is
 * asked to list employers has at least one: an employee on parental leave, or a
 * grant applicant who had an employer in the last six months.
 */
export const employersValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  if (!Array.isArray(newAnswer)) {
    return undefined
  }

  const unverifiedRow = findUnverifiedVMSTRow(newAnswer, application)
  if (unverifiedRow !== -1) {
    return buildError(
      errorMessages.employersRatioInvalid,
      `employers[${unverifiedRow}].ratio`,
    )
  }

  if (newAnswer.length > 0) {
    return undefined
  }

  const {
    applicationType,
    isSelfEmployed,
    isReceivingUnemploymentBenefits,
    employerLastSixMonths,
  } = getApplicationAnswers(application.answers)

  const isEmployee =
    applicationType === PARENTAL_LEAVE &&
    isSelfEmployed !== YES &&
    isReceivingUnemploymentBenefits === NO
  const isGrantWithEmployer =
    (applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
    employerLastSixMonths === YES

  if (isEmployee || isGrantWithEmployer) {
    return buildError(
      parentalLeaveFormMessages.employer.addEmployerError,
      'employers',
    )
  }

  return undefined
}
