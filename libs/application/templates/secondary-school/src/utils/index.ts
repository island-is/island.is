import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  NationalRegistryParent,
} from '@island.is/application/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import kennitala from 'kennitala'
import { SecondarySchoolAnswers } from '..'

export const getParent = (
  externalData: ExternalData,
  index: number,
): NationalRegistryParent | undefined => {
  const parents = getValueViaPath<NationalRegistryParent[]>(
    externalData,
    'nationalRegistryParents.data',
  )
  return parents?.[index]
}

export const getHasParent = (
  externalData: ExternalData,
  index: number,
): boolean => {
  const parent = getParent(externalData, index)
  return !!parent
}

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return ''
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const formatKennitala = (nationalId: string | undefined): string => {
  if (!nationalId) return ''
  return kennitala.format(nationalId, '-')
}

export const getTranslatedProgram = (
  lang: string,
  program?: {
    nameIs?: string
    nameEn?: string
  },
): string => {
  return (lang === 'is' ? program?.nameIs : program?.nameEn) || ''
}

export const hasDuplicates = (arr: string[]): boolean => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return true // Duplicate found
      }
    }
  }
  return false // No duplicates
}

const getRegistrationEndDates = (formValue: FormValue): Date[] => {
  const answers = formValue as SecondarySchoolAnswers
  return [
    answers?.selection?.first?.firstProgram?.registrationEndDate,
    answers?.selection?.first?.secondProgram?.registrationEndDate,
    answers?.selection?.second?.firstProgram?.registrationEndDate,
    answers?.selection?.second?.secondProgram?.registrationEndDate,
    answers?.selection?.third?.firstProgram?.registrationEndDate,
    answers?.selection?.third?.secondProgram?.registrationEndDate,
  ]
    .filter((x) => !!x)
    .map((x) => (x ? new Date(x) : new Date()))
}

export const getFirstRegistrationEndDate = (answers: FormValue): Date => {
  return getRegistrationEndDates(answers).sort(
    (a, b) => a.getTime() - b.getTime(), // ascending order
  )[0]
}

export const getLastRegistrationEndDate = (answers: FormValue): Date => {
  return getRegistrationEndDates(answers).sort(
    (a, b) => b.getTime() - a.getTime(), // descending order
  )[0]
}

export const getEndOfDayUTC = (date: Date | undefined): Date => {
  if (!date) date = new Date()

  // Clone the date to avoid mutating the original
  const newDate = new Date(date.getTime())

  // Set the time to 23:59:59.999 UTC
  newDate.setUTCHours(23, 59, 59, 999)

  return newDate
}
