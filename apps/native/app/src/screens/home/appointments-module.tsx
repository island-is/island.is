import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { SafeAreaView, TouchableOpacity, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { ApolloError } from '@apollo/client'

import {
  Typography,
  Heading,
  ChevronRight,
  ViewPager,
  EmptyCard,
  GeneralCardSkeleton,
} from '../../ui'
import { navigateTo } from '../../lib/deep-linking'
import { useNavigationModal } from '../../hooks/use-navigation-modal'
import { ComponentRegistry } from '../../utils/component-registry'
import {
  GetAppointmentsQuery,
  useGetAppointmentsQuery,
} from '../../graphql/types/schema'
import { AppointmentCard } from '../appointments/components/appointment-card'
import { screenWidth } from '../../utils/dimensions'

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
    const { showModal } = useNavigationModal()

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
            ? { width: viewPagerItemWidth, paddingLeft: theme.spacing[2], paddingBottom: theme.spacing[2], }
            : { paddingBottom: theme.spacing[2], }
        }
      >
        <AppointmentCard
          id={appointment.id}
          title={appointment.title ?? ''}
          practitioners={appointment.practitioners}
          date={appointment.date ?? ''}
          location={appointment.location?.name ?? ''}
          onPress={(id) => showModal(ComponentRegistry.AppointmentDetailScreen, { passProps: { appointmentId: id } })}
        />
      </View>
    ))

    return (
      <SafeAreaView
        style={{
          marginHorizontal: theme.spacing[2],
        }}
      >
        <Host>
          <TouchableOpacity
            disabled={count === 0}
            onPress={() => navigateTo('/appointments')}
          >
            <Heading
              button={
                count === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => navigateTo('/appointments')}
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
                <EmptyCard
                  text={intl.formatMessage({
                    id: 'health.appointments.noAppointmentsTitle',
                  })}
                  link={null}
                />
              )}
              {count === 1 && items}
              {count >= 2 && (
                <ViewPager itemWidth={viewPagerItemWidth}>{items}</ViewPager>
              )}
            </>
          )}
        </Host>
      </SafeAreaView>
    )
  },
)

export {
  AppointmentsModule,
  useGetAppointmentsQuery,
  validateAppointmentsInitialData,
}
