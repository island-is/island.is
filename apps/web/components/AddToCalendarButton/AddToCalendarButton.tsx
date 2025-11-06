import { Button, DropdownMenu } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

interface CalendarEvent {
  title: string
  description: string
  location: string
  pageUrl?: string
  startDate: string
  startTime?: string | null
  endTime?: string | null
  endDate?: string | null
}

const formatDate = (dateTime: string, isAllDay = false): string => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return isAllDay
    ? date.toISOString().split('T')[0].replace(/-/g, '') // Format YYYYMMDD for all-day events
    : date
        .toISOString()
        .replace(/-|:|\.\d+/g, '')
        .split('.')[0] // UTC format
}

const downloadICSFile = ({
  title,
  description,
  location,
  pageUrl,
  startDate,
  startTime,
  endTime,
  endDate,
}: CalendarEvent): void => {
  const isAllDay = !startTime || !endTime
  const startDateTime = isAllDay ? startDate : `${startDate}T${startTime}`
  let endDateTime: string | null = null
  if (endTime) {
    endDateTime = `${endDate ?? startDate}T${endTime}`
  } else if (isAllDay && (endDate ?? startDate)) {
    const endBase = endDate ?? startDate
    const exclusiveEnd = new Date(endBase)
    exclusiveEnd.setDate(exclusiveEnd.getDate() + 1) // ICS all-day DTEND is exclusive
    // Pass a date-only string; formatDate(..., true) will emit YYYYMMDD
    endDateTime = exclusiveEnd.toISOString().split('T')[0]
  }

  const fullDescription = `${pageUrl ? `${pageUrl}\n\n` : ''}${description}`

  // Use the correct time format for ICS
  const formattedStartDate = formatDate(startDateTime, isAllDay)
  const formattedEndDate = endDateTime
    ? formatDate(endDateTime, isAllDay && !endTime)
    : ''

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ísland.is//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${fullDescription.replace(/\n/g, '\\n')}
LOCATION:${location}
DTSTART:${formattedStartDate}
${formattedEndDate ? `DTEND:${formattedEndDate}` : ''}
END:VEVENT
END:VCALENDAR`

  const blob = new Blob([icsContent], { type: 'text/calendar' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${title.replace(/\s+/g, '_')}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const generateGoogleCalendarLink = (props: CalendarEvent) => {
  const baseUrl = 'https://www.google.com/calendar/render'
  const isAllDay = !props.startTime || !props.endTime
  const endDate = props.endDate ? props.endDate : props.startDate

  // Construct start and end date-time strings in the correct format
  const startDateTime = isAllDay
    ? formatDate(props.startDate, true) // YYYYMMDD
    : formatDate(`${props.startDate}T${props.startTime}`) // Full UTC format

  const endDateTime = props.endTime
    ? formatDate(`${endDate}T${props.endTime}`)
    : isAllDay
    ? formatDate(endDate, true) // Keep YYYYMMDD for all-day
    : null // No end time for time-based events if not provided

  // Prepend event page link to the description
  const fullDescription = `${props.pageUrl ? `${props.pageUrl}\n\n` : ''}${
    props.description
  }`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: props.title,
    details: fullDescription,
    location: props.location,
    dates: endDateTime ? `${startDateTime}/${endDateTime}` : startDateTime,
  })

  return `${baseUrl}?${params.toString()}`
}

interface AddToCalendarButtonProps {
  event: CalendarEvent
}

export const AddToCalendarButton = ({ event }: AddToCalendarButtonProps) => {
  const { activeLocale } = useI18n()
  const buttonTitle =
    activeLocale === 'is' ? 'Bæta við í dagatal' : 'Add to calendar'

  return (
    <DropdownMenu
      disclosure={
        <Button variant="text" size="small">
          {buttonTitle}
        </Button>
      }
      title={buttonTitle}
      items={[
        {
          title: 'iCalendar',
          onClick: () => {
            downloadICSFile(event)
          },
        },
        {
          title: 'Google Calendar',
          onClick: () => {
            window.open(
              generateGoogleCalendarLink(event),
              '_blank',
              'noopener, noreferrer',
            )
          },
        },
        {
          title: 'Outlook',
          onClick: () => {
            downloadICSFile(event)
          },
        },
      ]}
    />
  )
}
