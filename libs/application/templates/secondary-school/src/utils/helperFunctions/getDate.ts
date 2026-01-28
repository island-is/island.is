import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { SecondarySchoolAnswers } from '../..'
import { Locale } from '@island.is/shared/types'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import localeEN from 'date-fns/locale/en-GB'

const getRegistrationEndDates = (formValue: FormValue): Date[] => {
  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    formValue,
    'selection',
  )

  return [
    selection?.[0]?.firstProgram?.registrationEndDate,
    selection?.[0]?.secondProgram?.registrationEndDate,
    selection?.[1]?.firstProgram?.registrationEndDate,
    selection?.[1]?.secondProgram?.registrationEndDate,
    selection?.[2]?.firstProgram?.registrationEndDate,
    selection?.[2]?.secondProgram?.registrationEndDate,
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

export const getEndOfDayUTCDate = (date: Date | undefined): Date => {
  if (!date) date = new Date()

  // Clone the date to avoid mutating the original
  const newDate = new Date(date.getTime())

  // Set the time to 23:59:59.999 UTC
  newDate.setUTCHours(23, 59, 59, 999)

  return newDate
}

export const getDateWordStr = (
  date: Date | undefined,
  locale: Locale,
): string => {
  return date
    ? format(new Date(date), 'd. MMMM yyyy', {
        locale: locale === 'is' ? localeIS : localeEN,
      })
    : ''
}
