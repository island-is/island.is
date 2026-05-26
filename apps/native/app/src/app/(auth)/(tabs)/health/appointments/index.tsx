import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import styled from 'styled-components/native'

import illustrationSrc from '@/assets/illustrations/le-company-s3.png'
import { StackScreen } from '@/components/stack-screen'

import { BaseAppointmentStatuses } from '@/constants/base-appointment-statuses'
import { useGetAppointmentsQuery } from '@/graphql/types/schema'
import { EmptyList, GeneralCardSkeleton, Problem } from '@/ui'
import { AppointmentCard } from '../../../../../components/appointment-card'

const Host = styled(SafeAreaView)`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Appointments = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  row-gap: ${({ theme }) => theme.spacing[2]}px;
`

const ErrorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

export default function AppointmentsScreen() {
  const intl = useIntl()
  const router = useRouter()
  const [refetching, setRefetching] = useState(false)

  const appointmentsRes = useGetAppointmentsQuery({
    variables: {
      from: undefined,
      status: BaseAppointmentStatuses,
    },
    notifyOnNetworkStatusChange: true,
  })

  const appointments =
    appointmentsRes.data?.healthDirectorateAppointments.data ?? []

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
      router.navigate({
        pathname: '/health/appointments/[id]',
        params: { id: appointmentId },
      })
    },
    [router],
  )

  return (
    <View style={{ flex: 1 }}>
      <StackScreen
        networkStatus={appointmentsRes.networkStatus}
        options={{
          title: intl.formatMessage({
            id: 'health.appointments.screenTitle',
          }),
        }}
      />
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
              <EmptyList
                title={
                  <FormattedMessage id="health.appointments.noAppointmentsTitle" />
                }
                description={
                  <FormattedMessage id="health.appointments.noAppointmentsText" />
                }
                image={
                  <Image
                    source={illustrationSrc}
                    style={{ width: 134, height: 204 }}
                    resizeMode="contain"
                  />
                }
              />
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
