import { Box, DropdownMenu, Text } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

interface CalendarEvent {
  title: string
  description: string
  location: string
  pageUrl: string
  startDate: string
  startTime?: string | null
  endTime?: string | null
}

const formatDate = (dateTime: string, isAllDay = false): string => {
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
}: CalendarEvent): void => {
  const isAllDay = !startTime // Check if it's an all-day event
  const startDateTime = isAllDay ? startDate : `${startDate}T${startTime}`
  const endDateTime = endTime ? `${startDate}T${endTime}` : null

  const fullDescription = `${pageUrl}\n\n${description}`

  // Use the correct time format for ICS
  const formattedStartDate = formatDate(startDateTime, isAllDay)
  const formattedEndDate = endDateTime ? formatDate(endDateTime) : ''

  // ICS file content with improved formatting and line breaks
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

  // Construct start and end date-time strings
  const startDateTime = props.startTime
    ? `${props.startDate}T${props.startTime}`
    : props.startDate
  const endDateTime = props.endTime
    ? `${props.startDate}T${props.endTime}`
    : null

  // Prepend event page link to the description
  const fullDescription = `${props.pageUrl}\n\n${props.description}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: props.title,
    details: fullDescription,
    location: props.location,
    dates: endDateTime
      ? `${formatDate(startDateTime)}/${formatDate(endDateTime)}`
      : formatDate(startDateTime),
  })

  return `${baseUrl}?${params.toString()}`
}

interface AddToCalendarButtonProps {
  event: CalendarEvent
  textVariant?: 'small' | 'default'
}

export const AddToCalendarButton = ({
  event,
  textVariant = 'default',
}: AddToCalendarButtonProps) => {
  const { activeLocale } = useI18n()
  return (
    <DropdownMenu
      disclosure={
        <Box
          style={{
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          <Text variant={textVariant}>
            {activeLocale === 'is' ? 'Bæta við í dagatal' : 'Add to calendar'}
          </Text>
        </Box>
      }
      title={activeLocale === 'is' ? 'Bæta við í dagatal' : 'Add to calendar'}
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
