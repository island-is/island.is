import { ReactNode } from 'react'

import { HealthDirectorateAppointmentModality } from '@island.is/api/schema'
import { Box, Icon, IconMapIcon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  LinkButton,
  formatDate,
  getTime,
  getWeekday,
} from '@island.is/portals/my-pages/core'

import { messages } from '../../lib/messages'
import { generateGoogleMapsLink } from '../../utils/googleMaps'
import { mapWeekday } from '../../utils/mappers'
import { AppointmentDetailFieldsFragment } from './AppointmentDetail.generated'

interface Line {
  icon: IconMapIcon
  text: ReactNode
  link?: { to: string; label: string }
}

interface AppointmentDetailCardInfoProps {
  appointment: AppointmentDetailFieldsFragment
}

export const AppointmentDetailCardInfo = ({
  appointment,
}: AppointmentDetailCardInfoProps) => {
  const { formatMessage } = useLocale()

  const isVideo =
    appointment.modality === HealthDirectorateAppointmentModality.VIDEO

  const weekday = mapWeekday(getWeekday(appointment.date ?? ''), formatMessage)

  const mapsLink = generateGoogleMapsLink(
    appointment.location?.latitude,
    appointment.location?.longitude,
  )

  const fullAddress =
    [
      appointment.location?.name,
      appointment.location?.address,
      [appointment.location?.postalCode, appointment.location?.city]
        .filter(Boolean)
        .join(' '),
    ]
      .filter(Boolean)
      .join(', ') || undefined

  const locationLink =
    appointment.location?.locationLinks?.find((l) => l.type === 'WEBSITE')
      ?.url ??
    appointment.location?.link ??
    undefined

  const lines: Line[] = []

  if (appointment.date) {
    lines.push({
      icon: 'calendar',
      text: (
        <>
          {weekday ? `${weekday}, ` : ''}
          {formatDate(appointment.date)}
        </>
      ),
    })
    lines.push({ icon: 'time', text: getTime(appointment.date) })
  }

  if (appointment.duration) {
    lines.push({
      icon: 'hourglass',
      text: formatMessage(messages.argWithMinutes, {
        arg: appointment.duration,
      }),
    })
  }

  if (isVideo) {
    lines.push({
      icon: 'videoCam',
      text: formatMessage(messages.appointmentModalityVideo),
    })
  } else if (fullAddress) {
    lines.push({
      icon: 'location',
      text: fullAddress,
      link: mapsLink
        ? { to: mapsLink, label: formatMessage(messages.openMap) }
        : undefined,
    })
  }

  if (!isVideo && locationLink) {
    lines.push({
      icon: 'informationCircle',
      text: formatMessage(messages.locationInstructions),
      link: { to: locationLink, label: formatMessage(messages.seeMore) },
    })
  }

  return (
    <Stack space={2}>
      {lines.map((line, index) =>
        line.link ? (
          <Box key={index} display="flex" alignItems="flexStart" columnGap={1}>
            <Box flexShrink={0}>
              <Icon
                icon={line.icon}
                size="small"
                color="blue400"
                type="outline"
              />
            </Box>
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              columnGap={2}
            >
              <Text>{line.text}</Text>
              <LinkButton
                to={line.link.to}
                text={line.link.label}
                variant="text"
                size="small"
                icon="open"
              />
            </Box>
          </Box>
        ) : (
          <Box key={index} display="flex" alignItems="center" columnGap={1}>
            <Icon
              icon={line.icon}
              size="small"
              color="blue400"
              type="outline"
            />
            <Text>{line.text}</Text>
          </Box>
        ),
      )}
    </Stack>
  )
}
