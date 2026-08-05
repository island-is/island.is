import {
  BankAccountType,
  IS,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import type { Application } from '@island.is/application/types'
import { MONTHS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import addYears from 'date-fns/addYears'
import * as kennitala from 'kennitala'
import { RatioType } from './constants'
import {
  ApplicationType,
  earlyRetirementMaxAge,
  earlyRetirementMinAge,
} from './constants'
import {
  getAgeBetweenTwoDates,
  getApplicationAnswers,
  getApplicationExternalData,
} from './oldAgePensionUtils'
import { typeOfBankInfo } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'

export const isEarlyRetirement = (
  answers: Application['answers'],
  externalData: Application['externalData'],
) => {
  const { applicantNationalId } = getApplicationExternalData(externalData)
  const { selectedMonth, selectedYear, applicationType } =
    getApplicationAnswers(answers)

  if (!selectedMonth || !selectedYear) return false

  const dateOfBirth = kennitala.info(applicantNationalId).birthday
  const dateOfBirth00 = new Date(
    dateOfBirth.getFullYear(),
    dateOfBirth.getMonth(),
  )
  const selectedDate = new Date(
    +selectedYear,
    MONTHS.findIndex((x) => x.value === selectedMonth),
  )

  const age = getAgeBetweenTwoDates(selectedDate, dateOfBirth00)

  return (
    age >= earlyRetirementMinAge &&
    age <= earlyRetirementMaxAge &&
    applicationType !== ApplicationType.SAILOR_PENSION
  )
}

export const isMoreThan2Year = (answers: Application['answers']) => {
  const { selectedMonth, selectedYear } = getApplicationAnswers(answers)

  if (!selectedMonth || !selectedYear) return false

  const today = new Date()
  const startDate = addYears(today, -2)
  const selectedDate = new Date(selectedYear + selectedMonth)

  return startDate > selectedDate
}

export const isResidenceHistory = (
  externalData: Application['externalData'],
) => {
  const { residenceHistory } = getApplicationExternalData(externalData)
  // if no residence history returned, don't show the table
  if (residenceHistory.length === 0) return false
  return true
}

export const isResidenceHistoryOrOnlyIcelandic = (
  externalData: Application['externalData'],
) => {
  const { residenceHistory } = getApplicationExternalData(externalData)
  // if no residence history returned or if residence history is only iceland, show the question
  if (residenceHistory.length === 0) return true
  return residenceHistory.every((residence) => residence.country === IS)
}

export const isRatioType = (
  answers: Application['answers'],
  ratioType: RatioType,
) => {
  const { rawEmployers } = getApplicationAnswers(answers)
  const currentEmployer = rawEmployers[rawEmployers.length - 1]

  return currentEmployer?.ratioType === ratioType
}

export const isBankAccountType = (
  answers: Application['answers'],
  externalData: Application['externalData'],
  bankAccountType: BankAccountType,
) => {
  const { paymentInfo } = getApplicationAnswers(answers)
  const { bankInfo } = getApplicationExternalData(externalData)

  const radio =
    paymentInfo?.bankAccountType ??
    typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
  return radio === bankAccountType
}

export const hasSpouse = (externalData: Application['externalData']) => {
  const { hasSpouse: spouseData } = getApplicationExternalData(externalData)
  return !!spouseData
}
