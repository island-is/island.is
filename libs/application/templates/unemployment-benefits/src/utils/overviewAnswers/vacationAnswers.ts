import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import { FormText, FormValue } from '@island.is/application/types'
import { overview as overviewMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { VacationInAnswers } from '../../shared'
import { formatDate } from '../../utils'
export const useVacationAnswers = (answers: FormValue): Array<FormText> => {
  const { formatMessage } = useLocale()
  const hasVacation =
    getValueViaPath<YesOrNo>(answers, 'vacation.doYouHaveVacationDays', NO) ??
    NO

  const hasVacationString =
    hasVacation === NO
      ? formatMessage(overviewMessages.labels.payout.hadNoVacation)
      : undefined

  const numberOfDays = getValueViaPath<string>(answers, 'vacation.amount') ?? ''

  const intendedUsage = getValueViaPath<VacationInAnswers>(answers, 'vacation')

  const intendedUsageItems =
    hasVacation === YES
      ? intendedUsage?.vacationDays
          ?.filter((x) => !!x.amount)
          .map((intendedUsageItem) => {
            return `${formatMessage(
              overviewMessages.labels.payout.vacationDaysFrom,
            )}: ${formatDate(intendedUsageItem.startDate || '')} - ${formatDate(
              intendedUsageItem.endDate || '',
            )}`
          }) || []
      : []

  const valueItems = hasVacationString ? [hasVacationString] : []
  if (hasVacation === YES) {
    valueItems.push(
      `${formatMessage(
        overviewMessages.labels.payout.vacationDays,
      )}: ${numberOfDays}`,
      ...intendedUsageItems,
    )
  }
  return valueItems
}
