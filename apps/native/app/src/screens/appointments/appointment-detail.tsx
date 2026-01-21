import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { ImageSourcePropType, Linking, ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import { useFragment_experimental } from '@apollo/client/react/hooks'
import styled, { useTheme } from 'styled-components/native'
import externalLink from '../../assets/icons/external-link.png'
import { BaseAppointmentStatuses } from '../../constants/base-appointment-statuses'
import {
  AppointmentFragmentFragmentDoc,
  HealthDirectorateAppointment,
  useGetAppointmentsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import {
  Icon,
  Input,
  InputRow,
  NavigationBarSheet,
  Problem,
  Typography,
} from '../../ui'

const { useNavigationOptions } = createNavigationOptionHooks(() => ({
  topBar: {
    visible: false,
  },
}))

const HeaderContainer = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[1]}px;
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

export interface AppointmentDetailScreenProps {
  appointmentId: string
}

export const AppointmentDetailScreen: NavigationFunctionComponent<
  AppointmentDetailScreenProps
> = ({ componentId, appointmentId }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()

  // Try to get the appointment from cache first
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

  // Fallback: fetch all appointments if not in cache
  const { data, loading, error } = useGetAppointmentsQuery({
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

  const getWeekdayName = (d: Date) => {
    return intl.formatMessage({
      id: `health.appointments.weekday.${d.getDay()}`,
    })
  }

  const formatDateTime = (date?: string | null) => {
    if (!date) return '-'
    const dateObj = new Date(date)
    return `${getWeekdayName(dateObj)}, ${intl.formatDate(
      dateObj,
    )}, kl ${intl.formatTime(dateObj, { hour: '2-digit', minute: '2-digit' })}`
  }

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

  return (
    <View style={{ flex: 1 }}>
      <NavigationBarSheet
        componentId={componentId}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
        showLoading={loading}
      />
      <ScrollView style={{ flex: 1 }}>
        <HeaderContainer>
          <Typography variant="heading3">
            {intl.formatMessage({ id: 'health.appointments.detailTitle' })}
          </Typography>
          <Typography variant="body">
            {appointment?.location?.organization}
          </Typography>
        </HeaderContainer>
        <View>
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
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.dateAndTime',
                  })}
                  value={formatDateTime(appointment.date)}
                />
              </InputRow>

              {appointment.title && (
                <InputRow>
                  <Input
                    label={intl.formatMessage({
                      id: 'health.appointments.type',
                    })}
                    value={appointment.title}
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

              {appointment.duration && (
                <InputRow>
                  <Input
                    label={intl.formatMessage({
                      id: 'health.appointments.duration',
                    })}
                    value={intl.formatMessage(
                      { id: 'health.appointments.minutesFormat' },
                      { minutes: appointment.duration },
                    )}
                  />
                </InputRow>
              )}

              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'health.appointments.location',
                  })}
                  value={appointment.location?.name ?? '-'}
                />
              </InputRow>

              {appointment.location?.address && (
                <InputRow>
                  <Input
                    style={{
                      alignItems: 'center',
                    }}
                    label={intl.formatMessage({
                      id: 'health.appointments.address',
                    })}
                    value={formatAddress()}
                    rightElement={
                      <ExternalLinkContainer onPress={handleOpenMap}>
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
                          width={24}
                          height={24}
                        />
                      </ExternalLinkContainer>
                    }
                  />
                </InputRow>
              )}

              {appointment.practitioners &&
                appointment.practitioners.length > 0 && (
                  <InputRow>
                    <Input
                      label={intl.formatMessage({
                        id: 'health.appointments.appointmentWith',
                      })}
                      value={appointment.practitioners.join(', ')}
                    />
                  </InputRow>
                )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
