import get from 'lodash/get'

import { ParentalLeave, Period, Employer } from '@island.is/vmst-client'
import { Application } from '@island.is/application/core'

const extractAnswer = <T>(object: unknown, key: string): T | null => {
  const value = get(object, key, null) as T | null | undefined

  if (value === undefined || value === null) {
    return null
  }

  return value
}

export const transformApplicationToParentalLeaveDTO = (
  application: Application, // eslint-disable-line @typescript-eslint/no-unused-vars
): ParentalLeave => {
  const privatePensionFundRatioAnswer = extractAnswer(
    application.answers,
    'payments.privatePensionFundPercentage',
  )
  let privatePensionFundRatio: number | undefined
  if (privatePensionFundRatioAnswer === null) {
    privatePensionFundRatio = undefined
  } else if (typeof privatePensionFundRatioAnswer === 'string') {
    privatePensionFundRatio = Number(privatePensionFundRatioAnswer)
  }

  const periodsAnswer = extractAnswer<
    {
      startDate: string
      endDate: string
      ratio: string
    }[]
  >(application.answers, 'periods')
  let periods: Period[] = []

  if (periodsAnswer !== null) {
    periods = periodsAnswer.map((period) => ({
      from: period.startDate,
      to: period.endDate,
      ratio: Number(period.ratio),
    }))
  }

  // 'yes' will not be hard coded once the state machine has been moved into the api module
  const isSelfEmployed =
    extractAnswer(application.answers, 'employer.isSelfEmployed') === 'yes'

  const employer: Employer = {
    nationalRegistryId: isSelfEmployed
      ? application.applicant
      : extractAnswer(application.answers, 'employer.nationalRegistryId'),
    email: isSelfEmployed
      ? extractAnswer(application.answers, 'applicant.email')
      : extractAnswer(application.answers, 'employer.email'),
  }

  return {
    applicationId: application.id,
    applicant: application.applicant,
    otherParentId: extractAnswer(application.answers, 'otherParentId'),
    expectedDateOfBirth: extractAnswer(
      application.externalData,
      'pregnancyStatus.data.pregnancyDueDate',
    ),
    // TODO: get true date of birth, not expected
    dateOfBirth: extractAnswer(
      application.externalData,
      'pregnancyStatus.data.pregnancyDueDate',
    ),
    email: extractAnswer(application.answers, 'applicant.email'),
    phoneNumber: extractAnswer(application.answers, 'applicant.phoneNumber'),
    paymentInfo: {
      bankAccount: extractAnswer(application.answers, 'payments.bank'),
      personalAllowance:
        extractAnswer<number>(application.answers, 'personalAllowance.usage') ||
        0,
      personalAllowanceFromSpouse:
        extractAnswer<number>(
          application.answers,
          'personalAllowanceFromSpouse.usage',
        ) || 0,
      // TODO: get save union value from form
      union: extractAnswer(application.answers, 'union.todo'),
      // TODO: save object not string and use that here
      pensionFund: extractAnswer(
        application.answers,
        'payments.pensionFund.todo',
      ),
      // TODO: save object not string and use that here
      privatePensionFund: extractAnswer(
        application.answers,
        'payments.privatePensionFund.todo',
      ),
      privatePensionFundRatio,
    },
    periods,
    employers: [employer],
    status: null,
    rightsCode: null,
  }
}
