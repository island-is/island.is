import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import { BaseAppointmentStatuses } from '../../constants/base-appointment-statuses'
import {
  useGetAppointmentsQuery
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useNavigationModal } from '../../hooks/use-navigation-modal'
import { GeneralCardSkeleton, Problem, Typography } from '../../ui'
import { ComponentRegistry } from '../../utils/component-registry'
import { AppointmentCard } from './components/appointment-card'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Appointments = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  row-gap: ${({ theme }) => theme.spacing[2]}px;
`

const ErrorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const EmptyState = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  padding: ${({ theme }) => theme.spacing[3]}px;
  align-items: center;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.appointments.screenTitle' }),
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  }))

export const AppointmentsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const { showModal } = useNavigationModal()

  const appointmentsRes = useGetAppointmentsQuery({
    variables: {
      from: undefined,
      status: BaseAppointmentStatuses,
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  })

  const appointments =
    appointmentsRes.data?.healthDirectorateAppointments.data ?? []

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: appointmentsRes,
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      await appointmentsRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [appointmentsRes])

  const handleAppointmentPress = useCallback(
    (appointmentId: string) => {
      showModal(ComponentRegistry.AppointmentDetailScreen, {
        passProps: {
          appointmentId,
        },
      })
    },
    [showModal],
  )

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
          {(appointmentsRes.loading || refetching) && (
            <Appointments>
              {Array.from({ length: 3 }).map((_, index) => (
                <GeneralCardSkeleton height={100} key={index} />
              ))}
            </Appointments>
          )}

          {appointmentsRes.error && (
            <ErrorWrapper>
              <Problem
                type="error"
                title={intl.formatMessage({ id: 'problem.error.title' })}
                message={intl.formatMessage({
                  id: 'health.appointments.errorMessage',
                })}
                tag={appointmentsRes.error.message}
              />
            </ErrorWrapper>
          )}

          {!appointmentsRes.loading &&
            !appointmentsRes.error &&
            appointments.length === 0 && (
              <EmptyState>
                <Typography variant="heading3">
                  <FormattedMessage id="health.appointments.noAppointmentsTitle" />
                </Typography>
                <Typography>
                  <FormattedMessage id="health.appointments.noAppointmentsText" />
                </Typography>
              </EmptyState>
            )}

          {!appointmentsRes.loading &&
            !appointmentsRes.error &&
            appointments.length > 0 && (
              <Appointments>
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    title={appointment.title ?? ''}
                    practitioners={appointment.practitioners}
                    date={appointment.date ?? ''}
                    location={appointment.location?.name ?? ''}
                    onPress={handleAppointmentPress}
                  />
                ))}
              </Appointments>
            )}
        </Host>
      </ScrollView>
    </View>
  )
}

AppointmentsScreen.options = getNavigationOptions
