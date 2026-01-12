import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  formatDate,
  getTime,
  getWeekday,
  m,
} from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'

import { HealthDirectorateAppointmentStatus } from '@island.is/api/schema'
import { generateGoogleMapsLink } from '../../utils/googleMaps'
import { mapWeekday } from '../../utils/mappers'
import { useGetAppointmentsQuery } from './Appointments.generated'

const AppointmentDetail = () => {
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetAppointmentsQuery({
    variables: {
      from: undefined,
      status: [
        HealthDirectorateAppointmentStatus.BOOKED,
        HealthDirectorateAppointmentStatus.PENDING,
        HealthDirectorateAppointmentStatus.WAITLIST,
      ],
    },
  })

  const appointment = data?.healthDirectorateAppointments.data?.find(
    (appointment) => appointment.id === id,
  )

  return (
    <IntroWrapper
      title={messages.appointmentDetail}
      intro={messages.appointmentsDetailIntro}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
      loading={loading}
    >
      {!loading && !error && !appointment && <Problem type="no_data" />}
      {!error && (
        <InfoLineStack label={formatMessage(m.info)} space={1}>
          <InfoLine
            label={formatMessage(messages.dateAndTime)}
            content={
              appointment?.date
                ? [
                    mapWeekday(
                      getWeekday(appointment?.date ?? ''),
                      formatMessage,
                    ),
                    formatDate(appointment?.date ?? ''),
                    formatMessage(messages.clockShortArg, {
                      arg: getTime(appointment?.date ?? ''),
                    }),
                  ]
                    .filter(Boolean)
                    .join(', ')
                : undefined
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.type)}
            content={appointment?.title ?? undefined}
            loading={loading}
          />
          {appointment?.instruction && (
            <InfoLine
              label={formatMessage(messages.instructions)}
              content={appointment?.instruction}
              loading={loading}
            />
          )}
          {appointment?.duration && (
            <InfoLine
              label={formatMessage(messages.duration)}
              content={formatMessage(messages.argWithMinutes, {
                arg: appointment?.duration,
              })}
              loading={loading}
            />
          )}
          <InfoLine
            loading={loading}
            label={formatMessage(messages.locationAddress)}
            content={appointment?.location?.name}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(m.address)}
            content={[
              appointment?.location?.address,
              [appointment?.location?.postalCode, appointment?.location?.city]
                .filter(Boolean)
                .join(' '),
            ]
              .filter(Boolean)
              .join(', ')}
            button={
              appointment?.location?.address
                ? {
                    type: 'link',
                    to: generateGoogleMapsLink(
                      appointment.location?.address ?? '',
                    ),
                    icon: 'link',
                    label: formatMessage(messages.openMap),
                  }
                : undefined
            }
          />
          {(appointment?.practitioners?.length ?? 0) > 0 && (
            <InfoLine
              loading={loading}
              label={formatMessage(messages.appointmentAtSimple)}
              content={appointment?.practitioners.join(', ')}
            />
          )}
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default AppointmentDetail
