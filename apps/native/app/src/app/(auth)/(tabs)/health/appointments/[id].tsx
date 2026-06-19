import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { ImageSourcePropType, Linking, ScrollView, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { StackScreen } from '@/components/stack-screen'
import { useFragment_experimental } from '@apollo/client/react/hooks'
import styled, { useTheme } from 'styled-components/native'
import calendarIcon from '@/assets/icons/calendar.png'
import clockIcon from '@/assets/icons/clock.png'
import externalLink from '@/assets/icons/external-link.png'
import locationIcon from '@/assets/icons/location.png'
import hourglassIcon from '@/assets/icons/hourglass.png'
import { BaseAppointmentStatuses } from '@/constants/base-appointment-statuses'
import {
  AppointmentFragmentFragmentDoc,
  HealthDirectorateAppointment,
  useGetAppointmentsQuery,
} from '@/graphql/types/schema'
import { Icon, Input, InputRow, Problem, Typography } from '@/ui'
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
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const EyebrowContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const ExternalLinkContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.blue400};
  height: ${({ theme }) => theme.spacing[3]}px;
`

const ProblemContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
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

  const { data, loading, error, networkStatus } = useGetAppointmentsQuery({
    variables: {
      from: undefined,
      status: BaseAppointmentStatuses,
    },
    skip: !!appointmentFromCache?.data,
  })

  const appointment =
    appointmentFromCache?.data ??
    data?.healthDirectorateAppointments.data?.find(
      (apt) => apt.id === appointmentId,
    )

  const formatAddress = () => {
    if (!appointment?.location) return '-'
    const parts = [
      appointment.location.address,
      [appointment.location.postalCode, appointment.location.city]
        .filter(Boolean)
        .join(' '),
    ]
      .filter(Boolean)
      .join(', ')
    return parts || '-'
  }

  const handleOpenMap = useCallback(() => {
    if (appointment?.location?.address) {
      const address = encodeURIComponent(appointment.location.address)
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`
      Linking.openURL(url)
    }
  }, [appointment])

  const {
    weekday,
    date: dateStr,
    time,
  } = formatAppointmentDate(intl, appointment?.date)

  const hasMoreInfo =
    !!appointment &&
    ((appointment.practitioners?.length ?? 0) > 0 ||
      !!appointment.instruction ||
      !!appointment.location?.address)

  return (
    <View style={{ flex: 1 }}>
      <StackScreen
        closeable
        networkStatus={networkStatus}
        options={{ title: '' }}
      />
      <ScrollView style={{ flex: 1 }}>
        {error && (
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

        {!loading && !error && appointment && (
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

                {appointment.duration && (
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

                {appointment.location?.name && (
                  <IconRow>
                    <Icon
                      source={locationIcon as ImageSourcePropType}
                      width={16}
                      height={16}
                      tintColor="blue400"
                    />
                    <Typography variant="body">
                      {appointment.location.name}
                    </Typography>
                  </IconRow>
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

            {appointment.location?.address && (
              <InputRow>
                <Input
                  style={{ alignItems: 'center' }}
                  label={intl.formatMessage({
                    id: 'health.appointments.address',
                  })}
                  value={formatAddress()}
                  rightElement={
                    <ExternalLinkContainer onPress={handleOpenMap}>
                      <Typography variant="eyebrow" color={theme.color.blue400}>
                        {intl.formatMessage({
                          id: 'health.appointments.openMap',
                        })}
                      </Typography>
                      <Icon
                        source={externalLink as ImageSourcePropType}
                        width={24}
                        height={24}
                      />
                    </ExternalLinkContainer>
                  }
                />
              </InputRow>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}
