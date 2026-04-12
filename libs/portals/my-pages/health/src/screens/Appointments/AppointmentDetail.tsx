import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  formatDate,
  getTime,
  m,
} from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'

import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import { generateGoogleMapsLinkFromCoords } from '../../utils/googleMaps'
import { useGetAppointmentsQuery } from './Appointments.generated'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const AppointmentDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetAppointmentsQuery({
    variables: {
      from: undefined,
      status: DEFAULT_APPOINTMENTS_STATUS,
    },
  })

  const appointment = data?.healthDirectorateAppointments.data?.find(
    (appointment) => appointment.id === id,
  )

  const mapsLink = generateGoogleMapsLinkFromCoords(
    appointment?.location?.latitude,
    appointment?.location?.longitude,
  )

  return (
    <IntroWrapper
      title={messages.appointmentDetail}
      intro={messages.appointmentsDetailIntro}
      loading={loading}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!loading && !error && !appointment && <Problem type="no_data" />}
      {!error && (
        <InfoLineStack label={formatMessage(m.info)} space={1}>
          <InfoLine
            label={formatMessage(messages.type)}
            content={appointment?.title ?? undefined}
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.dateAndTime)}
            content={
              appointment?.date
                ? [
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
              mapsLink
                ? {
                    type: 'link',
                    to: mapsLink,
                    icon: 'link',
                    label: formatMessage(messages.openMap),
                  }
                : undefined
            }
          />
          {appointment?.instruction && (
            <InfoLine
              label={formatMessage(messages.instructions)}
              content={appointment.instruction}
              loading={loading}
            />
          )}
          {appointment?.duration && (
            <InfoLine
              label={formatMessage(messages.duration)}
              content={formatMessage(messages.argWithMinutes, {
                arg: appointment.duration,
              })}
              loading={loading}
            />
          )}
          {(appointment?.practitioners?.length ?? 0) > 0 && (
            <InfoLine
              loading={loading}
              label={formatMessage(messages.appointmentAtSimple)}
              content={appointment?.practitioners.join(', ')}
            />
          )}
          {appointment?.location?.organization ? (
            <InfoLine
              loading={loading}
              label={formatMessage(messages.organization)}
              content={appointment.location.organization}
            />
          ) : null}
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default AppointmentDetail
