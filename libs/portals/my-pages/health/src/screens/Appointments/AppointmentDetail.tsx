import { useEffect, useReducer } from 'react'
import {
  HealthDirectorateAppointmentLinkType,
  HealthDirectorateAppointmentModality,
} from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LinkButton,
  LinkResolver,
  formatDate,
  getTime,
  getWeekday,
} from '@island.is/portals/my-pages/core'
import { theme } from '@island.is/island-ui/theme'

import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'

import { generateGoogleMapsLink } from '../../utils/googleMaps'
import { mapWeekday } from '../../utils/mappers'
import { useGetAppointmentDetailQuery } from './AppointmentDetail.generated'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import * as styles from './AppointmentDetail.css'

type VideoCallPhase = 'before' | 'active' | 'expired'

const getVideoCallPhase = (
  activatesAt?: string | Date | null,
  expiresAt?: string | Date | null,
): VideoCallPhase => {
  if (!activatesAt || !expiresAt) return 'active'
  const now = Date.now()
  if (now >= new Date(expiresAt).getTime()) return 'expired'
  if (now >= new Date(activatesAt).getTime()) return 'active'
  return 'before'
}

const AppointmentDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetAppointmentDetailQuery({
    variables: { id: id ?? '' },
    skip: !id,
  })

  const appointment = data?.healthDirectorateAppointment

  const locationLink =
    appointment?.location?.locationLinks?.find((l) => l.type === 'WEBSITE')
      ?.url ??
    appointment?.location?.link ??
    undefined

  const mapsLink = generateGoogleMapsLink(
    appointment?.location?.latitude,
    appointment?.location?.longitude,
  )

  const videoCall = appointment?.links?.find(
    (l) => l.type === HealthDirectorateAppointmentLinkType.VIDEO_CALL,
  )
  const { activatesAt, expiresAt } = videoCall ?? {}

  const [, rerender] = useReducer((c) => c + 1, 0)
  // Pure derivation each render — always correct at render time, so the very
  // first render with a resolved activatesAt/expiresAt already reflects the
  // correct phase.
  const videoCallPhase = getVideoCallPhase(activatesAt, expiresAt)

  // Arm a single timer for the next phase boundary. No dep array: it re-arms
  // after every render, so a capped long wait chains itself, and a timer that
  // was delayed by tab throttling or laptop sleep self-corrects on the next
  // render instead of getting stuck.
  useEffect(() => {
    if (videoCallPhase === 'expired' || !activatesAt || !expiresAt) {
      return
    }
    const boundary =
      videoCallPhase === 'before'
        ? new Date(activatesAt).getTime()
        : new Date(expiresAt).getTime()
    // The cap keeps the delay well under the browser's 32-bit setTimeout
    // clamp; the floor prevents a tight re-arm loop if a timer fires early.
    const delay = Math.min(boundary - Date.now(), 60 * 60 * 1000)
    const timeout = setTimeout(rerender, Math.max(delay, 1000))
    return () => clearTimeout(timeout)
  })

  const videoCallLink = videoCall?.url
  const isVideoCallActive = videoCallPhase === 'active'
  const isVideoCallExpired = videoCallPhase === 'expired'

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
      {!loading && !error && !appointment && (
        <Problem
          type="no_data"
          title={formatMessage(messages.appointmentNotFound)}
          message={formatMessage(messages.appointmentNotFoundDetail)}
          imgSrc="./assets/images/nodata.svg"
          noBorder={false}
        />
      )}
      {!error && appointment && (
        <Stack space={5}>
          <Box border="standard" borderRadius="large" padding={[2, 2, 3]}>
            <Box
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
                  {appointment.modality ===
                    HealthDirectorateAppointmentModality.VIDEO && (
                    <Box display="flex" alignItems="center" columnGap={1}>
                      <Icon
                        icon="videoCam"
                        size="small"
                        color="blue400"
                        type="outline"
                      />
                      <Text>
                        {formatMessage(messages.appointmentModalityVideo)}
                      </Text>
                    </Box>
                  )}
                  {appointment.modality !==
                    HealthDirectorateAppointmentModality.VIDEO &&
                    fullAddress && (
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

                  {appointment.modality !==
                    HealthDirectorateAppointmentModality.VIDEO &&
                    locationLink && (
                      <Box display="flex" alignItems="flexStart" columnGap={1}>
                        <Box flexShrink={0}>
                          <Icon
                            icon="informationCircle"
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
                          <Text>
                            {formatMessage(messages.locationInstructions)}
                          </Text>
                          {locationLink && (
                            <LinkButton
                              to={locationLink}
                              text={formatMessage(messages.seeMore)}
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

            {appointment.modality ===
              HealthDirectorateAppointmentModality.VIDEO &&
              !isVideoCallExpired && (
                <Box marginTop={3}>
                  <AlertMessage
                    type="info"
                    message={
                      videoCallLink ? (
                        <Box className={styles.videoCallMessageRow}>
                          <Text variant="small">
                            {formatMessage(
                              isVideoCallActive
                                ? messages.appointmentVideoCallInfoWithLinkActive
                                : messages.appointmentVideoCallInfoWithLink,
                            )}
                          </Text>
                          {isVideoCallActive ? (
                            <LinkResolver
                              href={videoCallLink}
                              className={styles.videoCallLink}
                            >
                              <Button
                                as="span"
                                size="small"
                                fluid={isMobile}
                                unfocusable
                              >
                                {formatMessage(
                                  messages.appointmentVideoCallLink,
                                )}
                              </Button>
                            </LinkResolver>
                          ) : (
                            <Box className={styles.videoCallLink}>
                              <Button size="small" fluid={isMobile} disabled>
                                {formatMessage(
                                  messages.appointmentVideoCallLink,
                                )}
                              </Button>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        formatMessage(messages.appointmentVideoCallInfoNoLink)
                      )
                    }
                  />
                </Box>
              )}
          </Box>

          {((appointment.practitioners?.length ?? 0) > 0 ||
            appointment.instruction ||
            appointment.location?.phoneNumber ||
            appointment.location?.openingHoursText) && (
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
