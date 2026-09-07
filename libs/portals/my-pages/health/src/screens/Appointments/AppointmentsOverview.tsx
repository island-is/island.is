import { ApolloError } from '@apollo/client'
import { HealthDirectorateAppointment } from '@island.is/api/schema'
import { Box, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import {
  DEFAULT_APPOINTMENTS_STATUS,
  PAST_APPOINTMENTS_STATUS,
} from '../../utils/constants'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsQuery } from './Appointments.generated'

const AppointmentsOverview = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()

  const [pastTabVisited, setPastTabVisited] = useState(false)

  const { value: showSendMessageButton } = useFeatureFlag(
    Features.isServicePortalHealthMessagesPageEnabled,
    false,
  )

  const upcoming = useGetAppointmentsQuery({
    fetchPolicy: 'network-only',
    variables: {
      status: DEFAULT_APPOINTMENTS_STATUS,
    },
  })

  const past = useGetAppointmentsQuery({
    fetchPolicy: 'network-only',
    variables: {
      // The client defaults "from" to today when omitted, which would return
      // no past appointments — any date before the data migration works here
      from: new Date('2026-01-01'),
      status: PAST_APPOINTMENTS_STATUS,
    },
    skip: !pastTabVisited,
  })

  const upcomingAppointments =
    upcoming.data?.healthDirectorateAppointments?.data ?? []
  const pastAppointments = [
    ...(past.data?.healthDirectorateAppointments?.data ?? []),
  ].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  const renderAppointmentList = (
    appointments: HealthDirectorateAppointment[],
    query: { loading: boolean; error?: ApolloError },
    emptyText: string,
  ) => {
    if (query.loading) {
      return <CardLoader />
    }
    if (query.error) {
      return (
        <Problem
          type="internal_service_error"
          noBorder={false}
          error={query.error}
        />
      )
    }
    if (appointments.length === 0) {
      return (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noAppointmentsTitle)}
          message={emptyText}
          imgSrc="./assets/images/nodata.svg"
        />
      )
    }
    return (
      <Appointments
        data={{
          data: { data: appointments },
          loading: query.loading,
          error: query.error ? true : false,
        }}
        showLinkButton={false}
      />
    )
  }

  return (
    <IntroWrapper
      title={messages.appointmentsOverviewTitle}
      intro={messages.appointmentsIntro}
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirAppointmentsTooltip),
      }}
    >
      <Box
        display="flex"
        flexWrap="wrap"
        columnGap={2}
        rowGap={2}
        marginBottom={4}
      >
        {showSendMessageButton && (
          <LinkButton
            to={HealthPaths.HealthConversationsNew}
            text={formatMessage(messages.appointmentsSendMessageButton)}
            variant="utility"
            size="small"
            icon="arrowForward"
          />
        )}
        <LinkButton
          to={formatMessage(messages.heilsuveraMyPagesLink)}
          text={formatMessage(messages.heilsuveraMyPagesButton)}
          variant="utility"
          size="small"
          icon="open"
        />
      </Box>
      <Tabs
        label=""
        selected="upcoming"
        size="xs"
        contentBackground="transparent"
        onlyRenderSelectedTab
        onChange={(id) => {
          if (id === 'past') {
            setPastTabVisited(true)
          }
        }}
        tabs={[
          {
            id: 'upcoming',
            label: formatMessage(messages.upcomingAppointmentsTab),
            content: (
              <Box paddingTop={3}>
                {renderAppointmentList(
                  upcomingAppointments,
                  upcoming,
                  formatMessage(messages.noAppointmentsText),
                )}
              </Box>
            ),
          },
          {
            id: 'past',
            label: formatMessage(messages.pastAppointmentsTab),
            content: (
              <Box paddingTop={3}>
                <Text variant="medium" marginBottom={3}>
                  {formatMessage(messages.pastAppointmentsNote)}
                </Text>
                {renderAppointmentList(
                  pastAppointments,
                  past,
                  formatMessage(messages.noPastAppointmentsText),
                )}
              </Box>
            ),
          },
        ]}
      />
    </IntroWrapper>
  )
}

export default AppointmentsOverview
