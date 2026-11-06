import { FC, useEffect, useMemo } from 'react'
import {
  AnnualMultiRangeCalendar,
  AnnualMultiRangeCalendarLabels,
} from '@island.is/application/ui-components/annual-multi-range-calendar'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import {
  applicationMessages as m,
  monthMessages,
  weekdayMessages,
} from '../lib/messages'
import { getOvernightDates } from '../utils/homeLodgings'

export const OvernightStayCalendar: FC<FieldBaseProps> = ({
  error,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()
  const year = Number(watch('year')) || new Date().getFullYear()
  const overnightDates = watch('overnightDates')
  const selectedDates = useMemo(
    () => (Array.isArray(overnightDates) ? overnightDates : []),
    [overnightDates],
  )
  const numberOfNights = useMemo(
    () => getOvernightDates(selectedDates).length,
    [selectedDates],
  )

  useEffect(() => {
    if (!setBeforeSubmitCallback) {
      return
    }

    setBeforeSubmitCallback(async () => {
      if (numberOfNights === 0) {
        return [false, formatMessage(m.calendarRequired)]
      }

      return [true, null]
    })

    return () => setBeforeSubmitCallback(null)
  }, [formatMessage, numberOfNights, setBeforeSubmitCallback])

  const labels = useMemo<AnnualMultiRangeCalendarLabels>(
    () => ({
      title: formatMessage(m.calendarTitle, { year }),
      description: formatMessage(m.calendarDescription),
      months: monthMessages.map((message) => formatMessage(message)),
      weekdays: weekdayMessages.map((message) => formatMessage(message)),
      keyboardInstructions: formatMessage(m.calendarKeyboardInstructions),
      formatDayAriaLabel: (date) =>
        formatMessage(m.calendarDayAriaLabel, {
          day: date.getDate(),
          month: formatMessage(monthMessages[date.getMonth()]),
          year: date.getFullYear(),
        }),
      formatRangeStartSelected: (date) =>
        formatMessage(m.calendarRangeStartSelected, {
          date: formatMessage(m.calendarDayAriaLabel, {
            day: date.getDate(),
            month: formatMessage(monthMessages[date.getMonth()]),
            year: date.getFullYear(),
          }),
        }),
      formatRangeSelected: (from, to) =>
        formatMessage(m.calendarRangeSelected, {
          from: formatMessage(m.calendarDayAriaLabel, {
            day: from.getDate(),
            month: formatMessage(monthMessages[from.getMonth()]),
            year: from.getFullYear(),
          }),
          to: formatMessage(m.calendarDayAriaLabel, {
            day: to.getDate(),
            month: formatMessage(monthMessages[to.getMonth()]),
            year: to.getFullYear(),
          }),
        }),
      rangeRemoved: formatMessage(m.calendarRangeRemoved),
    }),
    [formatMessage, year],
  )

  return (
    <AnnualMultiRangeCalendar
      id="overnight-stay-calendar"
      year={year}
      selectedDates={selectedDates}
      onChange={(dates) =>
        setValue('overnightDates', dates, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
      labels={labels}
      error={error}
    />
  )
}
