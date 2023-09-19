import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'

import { MAX_MONTHS_BACKWARD, MAX_MONTHS_FORWARD, MONTHS } from './constants'

export function getApplicationAnswers(answers: Application['answers']) {
  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  return {
    applicantEmail,
    applicantPhonenumber,
    selectedMonth,
    selectedYear,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  return {
    applicantName,
    applicantNationalId,
  }
}

export function getStartDateAndEndDate() {
  // Applicant could apply from the 2 year ago since 1st of next month
  // Until 6 month ahead
  const today = new Date()
  const nextMonth = addMonths(today, 1)

  const startDate = addMonths(nextMonth, MAX_MONTHS_BACKWARD)
  const endDate = addMonths(today, MAX_MONTHS_FORWARD)

  if (startDate > endDate) return {}

  return { startDate, endDate }
}

export function getAvailableMonths(selectedYear: string) {
  const { startDate, endDate } = getStartDateAndEndDate()

  if (!startDate || !endDate || !selectedYear) return []

  let months = MONTHS
  if (startDate.getFullYear().toString() === selectedYear) {
    months = months.slice(startDate.getMonth(), months.length + 1)
  } else if (endDate.getFullYear().toString() === selectedYear) {
    months = months.slice(0, endDate.getMonth() + 1)
  }

  return months
}

export function getAvailableYears() {
  const { startDate, endDate } = getStartDateAndEndDate()
  if (!startDate || !endDate) return []

  const startDateYear = startDate.getFullYear()
  const endDateYear = endDate.getFullYear()

  return Array.from(Array(endDateYear - startDateYear + 1).keys()).map((x) => {
    const theYear = x + startDateYear
    return { value: theYear.toString(), label: theYear.toString() }
  })
}

export function isMoreThan2Year(answers: Application['answers']) {
  const { selectedMonth, selectedYear } = getApplicationAnswers(answers)
  const today = new Date()
  const startDate = addMonths(today, MAX_MONTHS_BACKWARD)
  const selectedDate = new Date(selectedYear + selectedMonth)

  return startDate > selectedDate
}
