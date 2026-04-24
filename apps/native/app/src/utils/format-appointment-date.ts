import { IntlShape } from 'react-intl'
import { capitalize } from '@/utils/capitalize'

export const formatAppointmentDate = (
  intl: IntlShape,
  date?: string | null,
) => {
  if (!date) {
    // Fallback values
    return {
      weekday: '-',
      date: '-',
      time: '-',
    }
  }

  const dateObj = new Date(date)
  const weekday = intl.formatDate(dateObj, { weekday: 'long' })
  const dateStr = intl.formatDate(dateObj)
  const time = intl.formatTime(dateObj, { hour: '2-digit', minute: '2-digit' })

  return {
    weekday: capitalize(weekday),
    date: dateStr,
    time: time,
  }
}
