import { ApolloError } from '@apollo/client'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { TouchableOpacity, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AppointmentCard } from '@/components/appointment-card'
import {
  GetAppointmentsQuery,
  useGetAppointmentsQuery,
} from '@/graphql/types/schema'
import {
  ChevronRight,
  EmptyState,
  GeneralCardSkeleton,
  Heading,
  Typography,
  ViewPager,
} from '@/ui'
import { screenWidth } from '@/utils/dimensions'
import { router } from 'expo-router'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

interface AppointmentsModuleProps {
  data: GetAppointmentsQuery | undefined
  loading: boolean
  error?: ApolloError | undefined
}

const validateAppointmentsInitialData = ({
  data,
  loading,
  error,
}: {
  data: GetAppointmentsQuery | undefined
  loading: boolean
  error?: ApolloError
}) => {
  if (loading) {
    return true
  }

  if (error) {
    return true
  }

  if ((data?.healthDirectorateAppointments?.data?.length ?? 0) > 0) {
    return true
  }

  return false
}

const AppointmentsModule = React.memo(
  ({ data, loading, error }: AppointmentsModuleProps) => {
    const theme = useTheme()
    const intl = useIntl()

    if (error && !data) {
      return null
    }

    const appointments = data?.healthDirectorateAppointments?.data ?? []
    const count = appointments.length
    const viewPagerItemWidth = screenWidth - theme.spacing[2] * 3

    const items = appointments.slice(0, 3).map((appointment) => (
      <View
        key={appointment.id}
        style={
          count > 1
            ? {
                width: viewPagerItemWidth,
                paddingLeft: theme.spacing[2],
                paddingBottom: theme.spacing[2],
              }
            : { paddingBottom: theme.spacing[2] }
        }
      >
        <AppointmentCard
          id={appointment.id}
          title={appointment.title ?? ''}
          practitioners={appointment.practitioners}
          date={appointment.date ?? ''}
          location={appointment.location?.name ?? ''}
          onPress={(id) =>
            router.navigate({
              pathname: '/health/appointments/[id]',
              params: { id },
            })
          }
        />
      </View>
    ))

    return (
      <View
        style={{
          marginHorizontal: theme.spacing[2],
        }}
      >
        <Host>
          <TouchableOpacity
            disabled={count === 0}
            onPress={() => router.navigate('/health/appointments')}
          >
            <Heading
              button={
                count === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => router.navigate('/health/appointments')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="heading5" color={theme.color.blue400}>
                      <FormattedMessage id="button.seeAll" />
                    </Typography>
                    <ChevronRight />
                  </TouchableOpacity>
                )
              }
            >
              <FormattedMessage id="homeOptions.appointments" />
            </Heading>
          </TouchableOpacity>
          {loading && !data ? (
            <GeneralCardSkeleton height={100} />
          ) : (
            <>
              {count === 0 && (
                <EmptyState
                  title={intl.formatMessage({
                    id: 'health.appointments.noAppointmentsTitle',
                  })}
                  description={intl.formatMessage({
                    id: 'health.appointments.noAppointmentsText',
                  })}
                />
              )}
              {count === 1 && items}
              {count >= 2 && (
                <ViewPager itemWidth={viewPagerItemWidth}>{items}</ViewPager>
              )}
            </>
          )}
        </Host>
      </View>
    )
  },
)

export {
  AppointmentsModule,
  useGetAppointmentsQuery,
  validateAppointmentsInitialData,
}
