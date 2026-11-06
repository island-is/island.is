import { useMemo } from 'react'
import { AnnualMultiRangeCalendar } from '@island.is/application/ui-components'
import type { AnnualMultiRangeCalendarLabels } from '@island.is/application/ui-components'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const ExampleAnnualMultiRangeCalendar = ({
  error,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()
  const year = new Date().getFullYear()
  const watchedDates = watch('annualMultiRangeCalendar')
  const selectedDates = Array.isArray(watchedDates) ? watchedDates : []

  const labels = useMemo<AnnualMultiRangeCalendarLabels>(
    () => ({
      title: formatMessage(m.annualMultiRangeCalendarTitle),
      description: formatMessage(m.annualMultiRangeCalendarDescription),
      months,
      weekdays,
      keyboardInstructions: formatMessage(
        m.annualMultiRangeCalendarKeyboardInstructions,
      ),
      formatDayAriaLabel: (date) =>
        `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
      formatRangeStartSelected: (date) =>
        formatMessage(m.annualMultiRangeCalendarRangeStartSelected, {
          date: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
        }),
      formatRangeSelected: (from, to) =>
        formatMessage(m.annualMultiRangeCalendarRangeSelected, {
          from: `${from.getDate()} ${months[from.getMonth()]} ${from.getFullYear()}`,
          to: `${to.getDate()} ${months[to.getMonth()]} ${to.getFullYear()}`,
        }),
      rangeRemoved: formatMessage(m.annualMultiRangeCalendarRangeRemoved),
    }),
    [formatMessage],
  )

  return (
    <AnnualMultiRangeCalendar
      id="example-annual-multi-range-calendar"
      year={year}
      selectedDates={selectedDates}
      onChange={(dates) =>
        setValue('annualMultiRangeCalendar', dates, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
      labels={labels}
      error={error}
    />
  )
}
