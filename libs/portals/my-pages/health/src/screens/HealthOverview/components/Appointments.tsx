import { HealthDirectorateAppointments } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  getTime,
  getWeekday,
  InfoCardGrid,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../..'
import { HealthPaths } from '../../../lib/paths'
import { generateGoogleMapsLink } from '../../../utils/googleMaps'
import { mapWeekday } from '../../../utils/mappers'
import { DataState } from '../../../utils/types'

interface Props {
  data?: DataState<HealthDirectorateAppointments | null>
  showLinkButton?: boolean
}

const Appointments: React.FC<Props> = ({ data, showLinkButton }) => {
  const { formatMessage } = useLocale()
  const appointments = data?.data?.data
  const isEmpty = !appointments || appointments?.length === 0

  const cards = data?.loading
    ? [{ loading: true, title: '', description: '' }]
    : data?.error
    ? [
        {
          error: data?.error,
          title: formatMessage(messages.appointments),
          description: '',
        },
      ]
    : appointments?.map((appointment) => ({
        id: appointment.id,
        loading: false,
        error: data?.error,
        title: appointment.title ?? '',
        description: formatMessage(messages.appointmentAt, {
          arg: appointment.practitioners.join(', '),
        }),
        to: HealthPaths.HealthAppointmentDetail.replace(':id', appointment.id),
        href: HealthPaths.HealthAppointments,
        appointment: {
          date: formatDate(appointment.date ?? ''),
          time: getTime(appointment.date ?? ''),
          weekday: mapWeekday(
            getWeekday(appointment.date ?? ''),
            formatMessage,
          ),
          location: {
            label: appointment.location?.name ?? '',
            href: generateGoogleMapsLink(appointment.location?.address ?? ''),
          },
        },
      })) ?? []

  return (
    <Box marginBottom={2}>
      <Box
        display={'flex'}
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={2}
      >
        <Box>
          <Text variant="eyebrow" color="foregroundBrandSecondary">
            {formatMessage(messages.myAppointments)}
          </Text>
        </Box>
        {showLinkButton && (
          <Box>
            <LinkButton
              to={HealthPaths.HealthAppointments}
              text={formatMessage(messages.allAppointments)}
              variant="text"
              size="small"
              icon="arrowForward"
            />
          </Box>
        )}
      </Box>
      <InfoCardGrid
        cards={cards}
        size={isEmpty ? 'small' : undefined}
        empty={
          isEmpty && !data?.loading
            ? {
                title: formatMessage(messages.noAppointmentsTitle),
                description: formatMessage(messages.noAppointmentsText),
              }
            : undefined
        }
        variant="appointment"
      />
    </Box>
  )
}

export default Appointments
