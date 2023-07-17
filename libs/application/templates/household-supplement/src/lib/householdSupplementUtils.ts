import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { MONTHS } from './constants'
import { addMonths, addYears, subYears } from 'date-fns'

export function getApplicationAnswers(answers: Application['answers']) {
  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  return {
    bank,
    selectedYear,
    selectedMonth,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  // const bank = getValueViaPath(
  //   externalData,
  //   'userProfile.data.bankInfo',
  // ) as string

  return {
    applicantNationalId,
    // bank,
  }
}

// returns awailable years. Awailable period is
// 2 years back in time and 6 months in the future.
export function getAvailableYears(application: Application) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )

  if (!applicantNationalId) return []

  const twoYearsBackInTime = subYears(new Date(), 2).getFullYear()
  const sixMonthsInTheFuture = addMonths(new Date(), 6).getFullYear()

  console.log('sixMonthsInTheFuture ', sixMonthsInTheFuture)
  return Array.from(
    Array(sixMonthsInTheFuture - (twoYearsBackInTime - 1)),
    (_, i) => {
      return {
        value: (i + twoYearsBackInTime).toString(),
        label: (i + twoYearsBackInTime).toString(),
      }
    },
  )
}

// returns awailable months for selected year, since awailable period is
// 2 years back in time and 6 months in the future.
export function getAvailableMonths(
  application: Application,
  selectedYear: string,
) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )

  if (!applicantNationalId) return []
  if (!selectedYear) return []

  const twoYearsBackInTime = subYears(new Date(), 2)
  const sixMonthsInTheFuture = addMonths(new Date(), 6)

  let months = MONTHS

  if (twoYearsBackInTime.getFullYear().toString() === selectedYear) {
    months = months.slice(twoYearsBackInTime.getMonth(), months.length + 1)
  } else if (sixMonthsInTheFuture.getFullYear().toString() === selectedYear) {
    months = months.slice(0, sixMonthsInTheFuture.getMonth() + 1)
  }

  return months
}
