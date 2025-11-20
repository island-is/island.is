import { HealthDirectorateAppointments } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InfoCardGrid, LinkButton } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../..'
import { HealthPaths } from '../../../lib/paths'
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
          title: '',
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
          date: appointment.date ?? '',
          time: appointment.time ?? '',
          location: {
            label: appointment.location?.name ?? '',
            href: `https://ja.is/?q=${appointment.location?.name ?? ''}`, // TODO: CHECK FOR OTHER SOLUTIONS
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
