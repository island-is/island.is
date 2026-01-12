import { useIntl } from 'react-intl'

/**
 * Hook that returns a function to format a date string into a localized date and time string.
 * @example
 * const formatDate = useDateTimeFormatter()
 * formatDate('2024-01-01T13:45:00Z') // "1 January 2024, 13:45"
 */
export const useDateTimeFormatter = () => {
  const intl = useIntl()

  return (dt: string) => {
    const date = new Date(dt)

    const datePart = intl.formatDate(date, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const timePart = intl.formatTime(date, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return `${datePart}, ${timePart}`
  }
}
