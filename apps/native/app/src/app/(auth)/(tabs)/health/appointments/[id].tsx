import React, { useCallback, useEffect, useReducer } from 'react'
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
  HealthDirectorateAppointmentAssigneeType,
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

const InlineLink = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.blue400};
`

const MoreInfoRow = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  gap: ${({ theme }) => theme.spacing[1]}px;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${({ theme }) => theme.color.blue200};
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

type VideoCallPhase = 'before' | 'active' | 'expired'

// A missing/unparseable timestamp yields undefined, treated downstream as
// "not time-gated" so the link stays usable rather than blocking the call.
const toTimeMs = (value?: string | null): number | undefined => {
  if (!value) {
    return undefined
  }
  const ms = new Date(value).getTime()
  return Number.isNaN(ms) ? undefined : ms
}

const getVideoCallPhase = (
  activatesAtMs?: number,
  expiresAtMs?: number,
): VideoCallPhase => {
  if (activatesAtMs === undefined || expiresAtMs === undefined) {
    return 'active'
  }
  const now = Date.now()
  if (now >= expiresAtMs) {
    return 'expired'
  }
  if (now >= activatesAtMs) {
    return 'active'
  }
  return 'before'
}

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

  const renderSeeMore = (
    url: string,
    alignSelf: 'center' | 'flex-start' = 'center',
  ) => (
    <InlineLink style={{ alignSelf }} onPress={() => void openExternalUrl(url)}>
      <Typography variant="eyebrow" color={theme.color.blue400}>
        {intl.formatMessage({ id: 'health.appointments.seeMore' })}
      </Typography>
      <Icon
        source={externalLink as ImageSourcePropType}
        width={16}
        height={16}
      />
    </InlineLink>
  )

  const locationLinks = appointment?.location?.locationLinks
  const locationLink =
    locationLinks?.find((l) => l.type === 'WEBSITE')?.url ??
    locationLinks?.[0]?.url

  // assignees and the finer location fields only exist on the detail type,
  // not the cached list fragment, so read them off the query result directly.
  const detail = data?.healthDirectorateAppointment

  const findLink = (type: HealthDirectorateAppointmentLinkType) =>
    detail?.links?.find((l) => l.type === type)?.url
  const preparationLink = findLink(
    HealthDirectorateAppointmentLinkType.Preparation,
  )
  const patientInstructionsLink = findLink(
    HealthDirectorateAppointmentLinkType.PatientInstructions,
  )
  const organizationInfoLink = findLink(
    HealthDirectorateAppointmentLinkType.OrganizationInfo,
  )

  const assigneeTypeLabel = (
    type: HealthDirectorateAppointmentAssigneeType,
  ) => {
    switch (type) {
      case HealthDirectorateAppointmentAssigneeType.Role:
        return intl.formatMessage({
          id: 'health.appointments.assigneeTypeRole',
        })
      case HealthDirectorateAppointmentAssigneeType.Room:
        return intl.formatMessage({
          id: 'health.appointments.assigneeTypeRoom',
        })
      case HealthDirectorateAppointmentAssigneeType.Equipment:
        return intl.formatMessage({
          id: 'health.appointments.assigneeTypeEquipment',
        })
      case HealthDirectorateAppointmentAssigneeType.Service:
        return intl.formatMessage({
          id: 'health.appointments.assigneeTypeService',
        })
      case HealthDirectorateAppointmentAssigneeType.Team:
        return intl.formatMessage({
          id: 'health.appointments.assigneeTypeTeam',
        })
      default:
        return intl.formatMessage({
          id: 'health.appointments.assigneeTypeOther',
        })
    }
  }

  const isVideo =
    appointment?.modality === HealthDirectorateAppointmentModality.Video

  const videoCall = detail?.links?.find(
    (l) => l.type === HealthDirectorateAppointmentLinkType.VideoCall,
  )
  const videoCallLink = videoCall?.url

  // Activation window (link becomes usable / expires) comes from the server.
  const activatesAtMs = toTimeMs(videoCall?.activatesAt)
  const expiresAtMs = toTimeMs(videoCall?.expiresAt)

  const [, rerender] = useReducer((c) => c + 1, 0)
  const videoCallPhase = getVideoCallPhase(activatesAtMs, expiresAtMs)

  // Arm a timer for the next phase boundary. No dep array: it re-arms each
  // render, so a capped long wait chains itself and a sleep-delayed timer
  // self-corrects instead of getting stuck.
  useEffect(() => {
    if (
      videoCallPhase === 'expired' ||
      activatesAtMs === undefined ||
      expiresAtMs === undefined
    ) {
      return
    }
    const boundary = videoCallPhase === 'before' ? activatesAtMs : expiresAtMs
    const delay = Math.min(boundary - Date.now(), 60 * 60 * 1000)
    const timeout = setTimeout(rerender, Math.max(delay, 1000))
    return () => clearTimeout(timeout)
  })

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
      (detail?.assignees?.length ?? 0) > 0 ||
      !!appointment.instruction ||
      !!preparationLink ||
      !!detail?.location?.department ||
      !!detail?.location?.wing ||
      !!detail?.location?.floor ||
      !!detail?.location?.room ||
      !!appointment.location?.phoneNumber ||
      !!appointment.location?.openingHoursText ||
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
        contentContainerStyle={{ paddingBottom: 240 }}
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

            {detail?.assignees?.map((assignee, index) => (
              <InputRow key={`assignee-${index}`}>
                <Input
                  label={assigneeTypeLabel(assignee.type)}
                  value={assignee.name}
                />
              </InputRow>
            ))}

            {appointment.instruction && (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.instructions',
                  })}
                  value={appointment.instruction}
                  rightElement={
                    patientInstructionsLink
                      ? renderSeeMore(patientInstructionsLink)
                      : undefined
                  }
                />
              </InputRow>
            )}

            {preparationLink && (
              <MoreInfoRow>
                <Typography variant="body3">
                  {intl.formatMessage({
                    id: 'health.appointments.preparation',
                  })}
                </Typography>
                {renderSeeMore(preparationLink, 'flex-start')}
              </MoreInfoRow>
            )}

            {[
              {
                id: 'health.appointments.locationDepartment',
                value: detail?.location?.department,
              },
              {
                id: 'health.appointments.locationWing',
                value: detail?.location?.wing,
              },
              {
                id: 'health.appointments.locationFloor',
                value: detail?.location?.floor,
              },
              {
                id: 'health.appointments.locationRoom',
                value: detail?.location?.room,
              },
            ]
              .filter((line) => !!line.value)
              .map((line) => (
                <InputRow key={line.id}>
                  <Input
                    label={intl.formatMessage({ id: line.id })}
                    value={line.value}
                  />
                </InputRow>
              ))}

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

            {appointment.location?.organization && (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.organization',
                  })}
                  value={appointment.location.organization}
                  rightElement={
                    organizationInfoLink
                      ? renderSeeMore(organizationInfoLink)
                      : undefined
                  }
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
