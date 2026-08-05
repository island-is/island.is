import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ImageSourcePropType,
  Linking,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { StackScreen } from '@/components/stack-screen'
import { useFragment_experimental } from '@apollo/client/react/hooks'
import styled, { useTheme } from 'styled-components/native'
import calendarIcon from '@/assets/icons/calendar.png'
import clockIcon from '@/assets/icons/clock.png'
import externalLink from '@/assets/icons/external-link.png'
import infoIcon from '@/assets/icons/info-bubble-outline.png'
import locationIcon from '@/assets/icons/location.png'
import hourglassIcon from '@/assets/icons/hourglass.png'
import videoCameraIcon from '@/assets/icons/video-camera.png'
import {
  AppointmentFragmentFragmentDoc,
  HealthDirectorateAppointment,
  HealthDirectorateAppointmentLinkType,
  HealthDirectorateAppointmentModality,
  useGetAppointmentDetailQuery,
} from '@/graphql/types/schema'
import { Alert, Button, Icon, Input, InputRow, Problem, Typography } from '@/ui'
import { formatAppointmentDate } from '../../../../../utils/format-appointment-date'

const Header = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const IconList = styled.View`
  gap: ${({ theme }) => theme.spacing.p2}px;
`

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing[1]}px;
`

const MapLink = styled.TouchableOpacity`
  flex-direction: row;
  align-self: flex-start;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-left: ${({ theme }) => 16 + theme.spacing[1]}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.blue400};
`

const LocationItem = styled.View`
  gap: ${({ theme }) => theme.spacing[1]}px;
`

const EyebrowContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const ProblemContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const StickyFooter = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  background-color: ${({ theme }) => theme.color.white};
`

export default function AppointmentDetailScreen() {
  const { id: appointmentId } = useLocalSearchParams<{ id: string }>()
  const intl = useIntl()
  const theme = useTheme()

  const appointmentFromCache =
    useFragment_experimental<HealthDirectorateAppointment>({
      fragment: AppointmentFragmentFragmentDoc,
      fragmentName: 'AppointmentFragment',
      from: {
        __typename: 'HealthDirectorateAppointment',
        id: appointmentId,
      },
      returnPartialData: true,
    })

  const { data, loading, error, networkStatus } = useGetAppointmentDetailQuery({
    variables: { id: appointmentId ?? '' },
    skip: !appointmentId,
  })

  const appointment =
    data?.healthDirectorateAppointment ?? appointmentFromCache?.data

  const { latitude, longitude } = appointment?.location ?? {}
  const mapsLink =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null

  const openExternalUrl = useCallback(async (url?: string | null) => {
    if (!url) {
      return
    }
    try {
      const canOpen = await Linking.canOpenURL(url)
      if (canOpen) {
        await Linking.openURL(url)
      }
    } catch {
      // Swallow to avoid unhandled rejection if the OS cannot process the URL.
    }
  }, [])

  const handleOpenMap = useCallback(() => {
    void openExternalUrl(mapsLink)
  }, [mapsLink, openExternalUrl])

  const locationLinks = appointment?.location?.locationLinks
  const locationLink =
    locationLinks?.find((l) => l.type === 'WEBSITE')?.url ??
    locationLinks?.[0]?.url

  const isVideo =
    appointment?.modality === HealthDirectorateAppointmentModality.Video

  const videoCallLink = data?.healthDirectorateAppointment?.links?.find(
    (l) => l.type === HealthDirectorateAppointmentLinkType.VideoCall,
  )?.url

  type VideoCallPhase = 'before' | 'active' | 'expired'
  const [videoCallPhase, setVideoCallPhase] = useState<VideoCallPhase>('before')

  useEffect(() => {
    if (!appointment?.date) {
      setVideoCallPhase('before')
      return
    }
    const appointmentMs = new Date(appointment.date).getTime()
    const activateAtMs = appointmentMs - 5 * 60 * 1000
    // 1 hour after the appointment start time, we stop showing anything related to the link
    const deactivateAtMs = appointmentMs + 60 * 60 * 1000
    const now = Date.now()

    if (now >= deactivateAtMs) {
      setVideoCallPhase('expired')
      return
    }

    if (now >= activateAtMs) {
      setVideoCallPhase('active')
      const deactivateTimeout = setTimeout(
        () => setVideoCallPhase('expired'),
        deactivateAtMs - now,
      )
      return () => clearTimeout(deactivateTimeout)
    }

    setVideoCallPhase('before')

    // setTimeout in JS overflows past ~24.8 days (2^31 - 1 ms) and fires
    // immediately. For appointments further out, skip scheduling — the user
    // will revisit closer to the date and the next mount will set it up.
    const MAX_TIMEOUT_MS = 2 ** 31 - 1
    if (activateAtMs - now > MAX_TIMEOUT_MS) {
      return
    }

    const activateTimeout = setTimeout(() => {
      setVideoCallPhase('active')
    }, activateAtMs - now)
    const deactivateTimeout = setTimeout(
      () => setVideoCallPhase('expired'),
      deactivateAtMs - now,
    )
    return () => {
      clearTimeout(activateTimeout)
      clearTimeout(deactivateTimeout)
    }
  }, [appointment?.date])

  const isVideoCallActive = videoCallPhase === 'active'
  const isVideoCallExpired = videoCallPhase === 'expired'

  const handleStartVideoCall = useCallback(() => {
    void openExternalUrl(videoCallLink)
  }, [videoCallLink, openExternalUrl])

  // We want to show different messages depending on whether the video call link is available,
  // and whether the video call is active or not.
  const videoCallInfoMessageId = videoCallLink
    ? isVideoCallActive
      ? 'health.appointments.videoCallInfoWithLinkActive'
      : 'health.appointments.videoCallInfoWithLink'
    : 'health.appointments.videoCallInfoNoLink'

  const {
    weekday,
    date: dateStr,
    time,
  } = formatAppointmentDate(intl, appointment?.date)

  const hasMoreInfo =
    !!appointment &&
    ((appointment.practitioners?.length ?? 0) > 0 ||
      !!appointment.instruction ||
      !!appointment.location?.openingHoursText ||
      !!appointment.location?.phoneNumber ||
      !!appointment.location?.organization)

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <StackScreen
        closeable
        networkStatus={networkStatus}
        options={{ title: '' }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 64 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {error && !appointment && (
          <ProblemContainer>
            <Problem
              type="error"
              title={intl.formatMessage({ id: 'problem.error.title' })}
              message={intl.formatMessage({
                id: 'health.appointments.errorMessage',
              })}
              tag={error.message}
            />
          </ProblemContainer>
        )}

        {!loading && !error && !appointment && (
          <ProblemContainer>
            <Problem
              type="no_data"
              title={intl.formatMessage({ id: 'problem.noData.title' })}
              message={intl.formatMessage({
                id: 'health.appointments.notFoundMessage',
              })}
            />
          </ProblemContainer>
        )}

        {appointment && (
          <>
            <Header>
              {appointment.title && (
                <Typography variant="heading3">{appointment.title}</Typography>
              )}

              <IconList>
                {appointment.date && (
                  <IconRow>
                    <Icon
                      source={calendarIcon as ImageSourcePropType}
                      width={16}
                      height={16}
                      tintColor="blue400"
                    />
                    <Typography variant="body">
                      {weekday}, {dateStr}
                    </Typography>
                  </IconRow>
                )}

                {appointment.date && (
                  <IconRow>
                    <Icon
                      source={clockIcon as ImageSourcePropType}
                      width={16}
                      height={16}
                      tintColor="blue400"
                    />
                    <Typography variant="body">{time}</Typography>
                  </IconRow>
                )}

                {!!appointment.duration && (
                  <IconRow>
                    <Icon
                      source={hourglassIcon as ImageSourcePropType}
                      width={16}
                      height={16}
                      tintColor="blue400"
                    />
                    <Typography variant="body">
                      {intl.formatMessage(
                        { id: 'health.appointments.minutesFormat' },
                        { minutes: appointment.duration },
                      )}
                    </Typography>
                  </IconRow>
                )}

                {isVideo && (
                  <IconRow>
                    <Icon
                      source={videoCameraIcon as ImageSourcePropType}
                      width={16}
                      height={16}
                      tintColor="blue400"
                    />
                    <Typography variant="body">
                      {intl.formatMessage({
                        id: 'health.appointments.videoCall',
                      })}
                    </Typography>
                  </IconRow>
                )}

                {!isVideo && appointment.location?.name && (
                  <LocationItem>
                    <IconRow style={{ alignItems: 'flex-start' }}>
                      <Icon
                        source={locationIcon as ImageSourcePropType}
                        width={16}
                        height={16}
                        tintColor="blue400"
                        style={{ marginTop: 4 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Typography variant="body">
                          {[
                            appointment.location.name,
                            appointment.location.address,
                            [
                              appointment.location.postalCode,
                              appointment.location.city,
                            ]
                              .filter(Boolean)
                              .join(' '),
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </Typography>
                      </View>
                    </IconRow>
                    {mapsLink && (
                      <MapLink onPress={handleOpenMap}>
                        <Typography
                          variant="eyebrow"
                          color={theme.color.blue400}
                        >
                          {intl.formatMessage({
                            id: 'health.appointments.openMap',
                          })}
                        </Typography>
                        <Icon
                          source={externalLink as ImageSourcePropType}
                          width={16}
                          height={16}
                        />
                      </MapLink>
                    )}
                  </LocationItem>
                )}

                {!isVideo && locationLink && (
                  <LocationItem>
                    <IconRow>
                      <Icon
                        source={infoIcon as ImageSourcePropType}
                        width={16}
                        height={16}
                        tintColor="blue400"
                      />
                      <Typography variant="body">
                        {intl.formatMessage({
                          id: 'health.appointments.locationInstructions',
                        })}
                      </Typography>
                    </IconRow>
                    <MapLink onPress={() => void openExternalUrl(locationLink)}>
                      <Typography variant="eyebrow" color={theme.color.blue400}>
                        {intl.formatMessage({
                          id: 'health.appointments.seeMore',
                        })}
                      </Typography>
                      <Icon
                        source={externalLink as ImageSourcePropType}
                        width={16}
                        height={16}
                      />
                    </MapLink>
                  </LocationItem>
                )}
              </IconList>
            </Header>

            {hasMoreInfo && (
              <EyebrowContainer>
                <Typography variant="eyebrow" color={theme.color.purple400}>
                  {intl.formatMessage({
                    id: 'health.appointments.moreInfo',
                  })}
                </Typography>
              </EyebrowContainer>
            )}

            {appointment.practitioners && appointment.practitioners.length > 0 && (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.appointmentWith',
                  })}
                  value={appointment.practitioners.join(', ')}
                />
              </InputRow>
            )}

            {appointment.instruction && (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.instructions',
                  })}
                  value={appointment.instruction}
                />
              </InputRow>
            )}

            {appointment.location?.openingHoursText && (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.openingHours',
                  })}
                  value={appointment.location.openingHoursText}
                />
              </InputRow>
            )}

            {appointment.location?.phoneNumber && (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.phoneNumber',
                  })}
                  value={appointment.location.phoneNumber}
                />
              </InputRow>
            )}

            {appointment.location?.organization && (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.organization',
                  })}
                  value={appointment.location.organization}
                />
              </InputRow>
            )}
          </>
        )}
      </ScrollView>

      {isVideo && !isVideoCallExpired && (
        <StickyFooter>
          <Alert
            type="info"
            hasBorder
            message={intl.formatMessage({ id: videoCallInfoMessageId })}
          />
          {videoCallLink && (
            <Button
              title={intl.formatMessage({
                id: 'health.appointments.startVideoCall',
              })}
              disabled={!isVideoCallActive}
              onPress={handleStartVideoCall}
              style={{ width: '100%', marginTop: theme.spacing[2] }}
            />
          )}
          <SafeAreaView />
        </StickyFooter>
      )}
    </View>
  )
}
