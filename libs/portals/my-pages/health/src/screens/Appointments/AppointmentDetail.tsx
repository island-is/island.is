import { Box, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LinkButton,
  formatDate,
  getTime,
  getWeekday,
} from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'

import { generateGoogleMapsLink } from '../../utils/googleMaps'
import { mapWeekday } from '../../utils/mappers'
import { useGetAppointmentDetailQuery } from './AppointmentDetail.generated'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const AppointmentDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetAppointmentDetailQuery({
    variables: { id: id ?? '' },
    skip: !id,
  })

  const appointment = data?.healthDirectorateAppointment

  const organizationLink =
    appointment?.links?.find((l) => l.type === 'ORGANIZATION_INFO')?.url ??
    appointment?.location?.link ??
    undefined

  const mapsLink = generateGoogleMapsLink(
    appointment?.location?.latitude,
    appointment?.location?.longitude,
  )

  const fullAddress =
    [
      appointment?.location?.name,
      appointment?.location?.address,
      [appointment?.location?.postalCode, appointment?.location?.city]
        .filter(Boolean)
        .join(' '),
    ]
      .filter(Boolean)
      .join(', ') || undefined

  const weekday = mapWeekday(getWeekday(appointment?.date ?? ''), formatMessage)

  return (
    <IntroWrapper
      title={messages.appointmentDetail}
      intro={messages.appointmentsDetailIntro}
      desktopContentSpan="10/12"
      loading={loading}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !appointment && <CardLoader />}
      {!loading && !error && !appointment && <Problem type="no_data" />}
      {!error && appointment && (
        <Stack space={5}>
          <Box
            border="standard"
            borderRadius="large"
            padding={[2, 2, 3]}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <Stack space={3}>
              <Text variant="h4" color="blue400">
                {appointment.title}
              </Text>
              <Stack space={2}>
                {appointment.date && (
                  <Box display="flex" alignItems="center" columnGap={1}>
                    <Icon
                      icon="calendar"
                      size="small"
                      color="blue400"
                      type="outline"
                    />
                    <Text>
                      {weekday ? `${weekday}, ` : ''}
                      {formatDate(appointment.date)}
                    </Text>
                  </Box>
                )}
                {appointment.date && (
                  <Box display="flex" alignItems="center" columnGap={1}>
                    <Icon
                      icon="time"
                      size="small"
                      color="blue400"
                      type="outline"
                    />
                    <Text>{getTime(appointment.date)}</Text>
                  </Box>
                )}
                {appointment.duration && (
                  <Box display="flex" alignItems="center" columnGap={1}>
                    <Icon
                      icon="hourglass"
                      size="small"
                      color="blue400"
                      type="outline"
                    />
                    <Text>
                      {formatMessage(messages.argWithMinutes, {
                        arg: appointment.duration,
                      })}
                    </Text>
                  </Box>
                )}
                {fullAddress && (
                  <Box display="flex" alignItems="flexStart" columnGap={1}>
                    <Box flexShrink={0}>
                      <Icon
                        icon="location"
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
                      <Text>{fullAddress}</Text>
                      {mapsLink && (
                        <LinkButton
                          to={mapsLink}
                          text={formatMessage(messages.openMap)}
                          variant="text"
                          size="small"
                          icon="open"
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Stack>
            <Box
              display={['none', 'none', 'block']}
              flexShrink={0}
              marginLeft={3}
              marginRight={6}
            >
              <img src="./assets/images/appointment.svg" alt="" />
            </Box>
          </Box>

          {((appointment.practitioners?.length ?? 0) > 0 ||
            appointment.instruction ||
            appointment.location?.phoneNumber ||
            appointment.location?.openingHoursText ||
            appointment.location?.organization) && (
            <InfoLineStack
              label={formatMessage(messages.appointmentMoreInfo)}
              space={1}
            >
              {(appointment.practitioners?.length ?? 0) > 0 && (
                <InfoLine
                  loading={loading}
                  label={formatMessage(messages.appointmentAtSimple)}
                  content={appointment.practitioners.join(', ')}
                />
              )}
              {appointment.instruction && (
                <InfoLine
                  loading={loading}
                  label={formatMessage(messages.instructions)}
                  content={appointment.instruction}
                />
              )}
              {appointment.location?.phoneNumber && (
                <InfoLine
                  loading={loading}
                  label={formatMessage(messages.phoneNumber)}
                  content={appointment.location.phoneNumber}
                />
              )}
              {appointment.location?.openingHoursText && (
                <InfoLine
                  loading={loading}
                  label={formatMessage(messages.openingHours)}
                  content={appointment.location.openingHoursText}
                />
              )}
              {appointment.location?.organization && (
                <InfoLine
                  loading={loading}
                  label={formatMessage(messages.organization)}
                  content={appointment.location.organization}
                  button={
                    organizationLink
                      ? {
                          type: 'link',
                          to: organizationLink,
                          icon: 'open',
                          label: formatMessage(messages.appointmentMoreInfo),
                        }
                      : undefined
                  }
                />
              )}
            </InfoLineStack>
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default AppointmentDetail
