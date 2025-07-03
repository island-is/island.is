import { getValueViaPath, NO, YesOrNo } from '@island.is/application/core'
import { FormText, FormValue } from '@island.is/application/types'
import { overview as overviewMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { VacationDaysInAnswers } from '../../shared'

export const useVacationAnswers = (answers: FormValue): Array<FormText> => {
  const { formatMessage } = useLocale()
  const hasVacation =
    getValueViaPath<YesOrNo>(answers, 'vacation.doYouHaveVacationDays', NO) ??
    NO

  const hasVacationString =
    hasVacation === NO
      ? formatMessage(overviewMessages.labels.payout.hadNoVacation)
      : ''

  const numberOfDays = getValueViaPath<string>(answers, 'vacation.amount') ?? ''

  const intendedUsage =
    getValueViaPath<Array<VacationDaysInAnswers>>(
      answers,
      'vacation.vacationDays',
      [],
    ) ?? []

  const intendedUsageItems = intendedUsage.map((intendedUsageItem) => {
    return `${formatMessage(
      overviewMessages.labels.payout.vacationDaysFrom,
    )}: ${intendedUsageItem.startDate} - ${intendedUsageItem.endDate}`
  })
  return [
    hasVacationString,
    `${formatMessage(
      overviewMessages.labels.payout.vacationDays,
    )}: ${numberOfDays}`,
    ...intendedUsageItems,
  ]
}
