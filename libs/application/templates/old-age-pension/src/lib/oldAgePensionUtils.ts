import { getValueViaPath } from '@island.is/application/core'
import { Application, YesOrNo } from '@island.is/application/types'
import { MONTHS } from './constants'
import { oldAgePensionFormMessage } from './messages'

import * as kennitala from 'kennitala'
import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'
import { residenceHistory } from '../types'

export function getApplicationAnswers(answers: Application['answers']) {
  const pensionFundQuestion = getValueViaPath(
    answers,
    'questions.pensionFund',
  ) as YesOrNo

  const isFishermen = getValueViaPath(answers, 'questions.fishermen') as YesOrNo

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const onePaymentPerYear = getValueViaPath(
    answers,
    'onePaymentPerYear.question',
  ) as YesOrNo

  return {
    pensionFundQuestion,
    isFishermen,
    selectedYear,
    selectedMonth,
    applicantEmail,
    applicantPhonenumber,
    onePaymentPerYear,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const residenceHistory = getValueViaPath(
    externalData,
    'nationalRegistryResidenceHistory.data',
    [],
  ) as residenceHistory[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantLocality = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.locality',
  ) as string

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  const spouseName = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.name',
  ) as string

  const spouseNationalId = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.nationalId',
  ) as string

  const maritalStatus = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.maritalStatus',
  ) as string

  return {
    residenceHistory,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    spouseName,
    spouseNationalId,
    maritalStatus,
  }
}

export function getStartDateAndEndDate(nationalId: string) {
  const today = new Date()
  const nationalIdInfo = kennitala.info(nationalId)
  const dateOfBirth = new Date(nationalIdInfo.birthday)
  const age = nationalIdInfo.age
  const dateOfBirthThisYear = new Date(
    today.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDay(),
  )

  const thisYearAge = dateOfBirthThisYear > today ? age + 1 : age

  let startDate = dateOfBirthThisYear
  let endDate = addMonths(today, 6)
  if (thisYearAge >= 67) {
    startDate = addYears(
      dateOfBirthThisYear > today ? dateOfBirthThisYear : today,
      -2,
    )
  } else if (thisYearAge === 66) {
    startDate = addYears(dateOfBirthThisYear, -1)
  } else if (thisYearAge < 65) {
    return {}
  }
  if (startDate > endDate) return {}

  return { startDate, endDate }
}

export function getAvailableYears(application: Application) {
  const { applicantNationalId } = getApplicationExternalData(
    application['externalData'],
  )
  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(applicantNationalId)
  if (!startDate || !endDate) return []

  const startDateYear = startDate.getFullYear()
  const endDateYear = endDate.getFullYear()

  return Array.from(Array(endDateYear - startDateYear + 1).keys()).map((x) => {
    const theYear = x + startDateYear
    return { value: theYear.toString(), label: theYear.toString() }
  })
}

export function getAvailableMonths(
  application: Application,
  selectedYear: string,
) {
  const { applicantNationalId } = getApplicationExternalData(
    application['externalData'],
  )
  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(applicantNationalId)
  if (!startDate || !endDate || !selectedYear) return []

  let months = MONTHS
  if (startDate.getFullYear().toString() === selectedYear) {
    months = months.slice(startDate.getMonth(), months.length + 1)
  } else if (endDate.getFullYear().toString() === selectedYear) {
    months = months.slice(0, endDate.getMonth() + 1)
  }

  return months.map((month) => {
    switch (month) {
      case 'January':
        return { value: month, label: oldAgePensionFormMessage.period.january }
      case 'February':
        return { value: month, label: oldAgePensionFormMessage.period.february }
      case 'March':
        return { value: month, label: oldAgePensionFormMessage.period.march }
      case 'April':
        return { value: month, label: oldAgePensionFormMessage.period.april }
      case 'May':
        return { value: month, label: oldAgePensionFormMessage.period.may }
      case 'June':
        return { value: month, label: oldAgePensionFormMessage.period.june }
      case 'July':
        return { value: month, label: oldAgePensionFormMessage.period.july }
      case 'Agust':
        return { value: month, label: oldAgePensionFormMessage.period.agust }
      case 'September':
        return {
          value: month,
          label: oldAgePensionFormMessage.period.september,
        }
      case 'October':
        return { value: month, label: oldAgePensionFormMessage.period.october }
      case 'November':
        return { value: month, label: oldAgePensionFormMessage.period.november }
      case 'December':
        return { value: month, label: oldAgePensionFormMessage.period.desember }
      default:
        return { value: '0', label: '' }
    }
  })
}

export function getAgeBetweenTwoDates(
  selectedDate: Date,
  dateOfBirth: Date,
): number {
  const diffTime = selectedDate.getTime() - dateOfBirth.getTime()
  const age = Math.abs(Math.floor(diffTime / (365.25 * 60 * 60 * 24 * 1000)))

  return age
}
