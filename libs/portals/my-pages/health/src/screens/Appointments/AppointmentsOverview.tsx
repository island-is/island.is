import { HealthDirectorateAppointment } from '@island.is/api/schema'
import { Box, Button, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatPlausiblePathToParams,
  STAFRAEN_HEILSA_SLUG,
  IntroWrapper,
  LinkButton,
  m,
} from '@island.is/portals/my-pages/core'
import {
  healthAppointmentsHeilsuveraClick,
  healthAppointmentsSendMessageClick,
} from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { Problem } from '@island.is/react-spa/shared'
import { useUserInfo } from '@island.is/react-spa/bff'
import { ApiScope } from '@island.is/auth/scopes'
import { useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { isPastAppointment } from '../../utils/appointments'
import {
  DEFAULT_APPOINTMENTS_STATUS,
  PAST_APPOINTMENTS_STATUS,
} from '../../utils/constants'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import Appointments from '../HealthOverview/components/Appointments'
import {
  GetAppointmentsQueryVariables,
  useGetAppointmentsQuery,
} from './Appointments.generated'

const DEFAULT_PAGE_SIZE = 10

// One cursor-paginated appointments list; "load more" appends the next page
const usePaginatedAppointments = (
  variables: Omit<GetAppointmentsQueryVariables, 'limit' | 'after'>,
  skip?: boolean,
) => {
  const [loadingMore, setLoadingMore] = useState(false)
  const query = useGetAppointmentsQuery({
    fetchPolicy: 'network-only',
    variables: { ...variables, limit: DEFAULT_PAGE_SIZE },
    skip,
  })
  const page = query.data?.healthDirectorateAppointments

  const loadMore = () => {
    const cursor = page?.pageInfo?.endCursor
    if (loadingMore || !cursor) return
    setLoadingMore(true)
    query
      .fetchMore({
        variables: { ...variables, limit: DEFAULT_PAGE_SIZE, after: cursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          const next = fetchMoreResult?.healthDirectorateAppointments
          if (!next) return prev
          return {
            ...fetchMoreResult,
            healthDirectorateAppointments: {
              ...next,
              data: [
                ...(prev.healthDirectorateAppointments?.data ?? []),
                ...(next.data ?? []),
              ],
            },
          }
        },
      })
      .finally(() => setLoadingMore(false))
  }

  return { ...query, page, loadMore, loadingMore }
}

const AppointmentsOverview = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  useHealthPlausibleSwap()

  const [pastTabVisited, setPastTabVisited] = useState(false)

  // Past appointments are only available for yourself and for parents of
  // children under 16 — those are the cases that carry the full health scope,
  // whereas other delegations only get healthAppointments
  const userInfo = useUserInfo()
  const hasPastAppointmentsAccess = !!userInfo?.scopes?.includes(
    ApiScope.health,
  )

  const { value: showSendMessageButton } = useFeatureFlag(
    Features.isServicePortalHealthMessagesPageEnabled,
    false,
  )

  const upcoming = usePaginatedAppointments({
    status: DEFAULT_APPOINTMENTS_STATUS,
  })

  const past = usePaginatedAppointments(
    {
      // The client defaults "from" to today when omitted, which would return
      // no past appointments — any date before the data migration works here
      from: new Date('2026-01-01'),
      status: PAST_APPOINTMENTS_STATUS,
    },
    !pastTabVisited || !hasPastAppointmentsAccess,
  )

  const upcomingAppointments = upcoming.page?.data ?? []
  const pastAppointments = (past.page?.data ?? [])
    // The query includes BOOKED, which also matches upcoming appointments
    .filter(isPastAppointment)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  const renderAppointmentList = (
    appointments: HealthDirectorateAppointment[],
    query: ReturnType<typeof usePaginatedAppointments>,
    emptyText: string,
    muted?: boolean,
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
      <>
        <Appointments
          data={{
            data: { data: appointments },
            loading: query.loading,
            error: query.error ? true : false,
          }}
          showLinkButton={false}
          showHeader={false}
          muted={muted}
        />
        {query.page?.pageInfo?.hasNextPage && (
          <Box display="flex" justifyContent="center" marginTop={3}>
            <Button
              onClick={query.loadMore}
              loading={query.loadingMore}
              variant="ghost"
              size="small"
            >
              {`${formatMessage(m.fetchMore)} ${query.page.data?.length ?? 0}/${
                query.page.totalCount ?? 0
              }`}
            </Button>
          </Box>
        )}
      </>
    )
  }

  return (
    <IntroWrapper
      title={messages.appointmentsOverviewTitle}
      intro={messages.appointmentsIntro}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaAppointmentsTooltip),
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
            callback={() =>
              healthAppointmentsSendMessageClick(
                formatPlausiblePathToParams(pathname),
              )
            }
          />
        )}
        <LinkButton
          to={formatMessage(messages.heilsuveraMyPagesLink)}
          text={formatMessage(messages.heilsuveraMyPagesButton)}
          variant="utility"
          size="small"
          icon="open"
          callback={() =>
            healthAppointmentsHeilsuveraClick(
              formatPlausiblePathToParams(pathname),
            )
          }
          skipOutboundTrack
        />
      </Box>
      <Tabs
        label={formatMessage(messages.appointmentsOverviewTitle)}
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
                {hasPastAppointmentsAccess ? (
                  <>
                    <Text marginBottom={3}>
                      {formatMessage(messages.pastAppointmentsNote)}
                    </Text>
                    {renderAppointmentList(
                      pastAppointments,
                      past,
                      formatMessage(messages.noPastAppointmentsText),
                      true,
                    )}
                  </>
                ) : (
                  <Problem
                    type="no_data"
                    noBorder={false}
                    title={formatMessage(m.accessNeeded)}
                    message={formatMessage(m.accessDeniedText)}
                    imgSrc="./assets/images/jobsGrid.svg"
                  />
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
