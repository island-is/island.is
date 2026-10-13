import {
  HealthDirectorateAppointmentsOrder,
  HealthDirectoratePaginatedAppointmentsInput,
} from '@island.is/api/schema'
import { Box, Button, Tabs, Text, toast } from '@island.is/island-ui/core'
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
import {
  getStartOfToday,
  nextAppointmentsInput,
} from '../../utils/appointments'
import { VISIBLE_APPOINTMENTS_STATUS } from '../../utils/constants'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsQuery } from './Appointments.generated'

const PAGE_SIZE = 20

const useAppointmentsPage = (
  input: HealthDirectoratePaginatedAppointmentsInput,
  skip?: boolean,
) => {
  const { formatMessage } = useLocale()
  const [loadingMore, setLoadingMore] = useState(false)
  const { data, loading, error, fetchMore } = useGetAppointmentsQuery({
    fetchPolicy: 'network-only',
    variables: { input },
    skip,
  })
  const page = data?.healthDirectoratePaginatedAppointments

  const loadMore = () => {
    const cursor = page?.pageInfo.endCursor
    if (loadingMore || !cursor) return
    setLoadingMore(true)
    // The field's cache policy appends the page to the current list
    fetchMore({ variables: { input: { ...input, after: cursor } } })
      .catch(() => toast.error(formatMessage(m.errorTitle)))
      .finally(() => setLoadingMore(false))
  }

  return {
    appointments: page?.data ?? [],
    totalCount: page?.totalCount ?? 0,
    hasNextPage: !!page?.pageInfo.hasNextPage,
    loading: loading && !data,
    error,
    loadMore,
    loadingMore,
  }
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

  const upcoming = useAppointmentsPage(nextAppointmentsInput(PAGE_SIZE))

  // Upcoming starts where this ends, at the start of today
  const past = useAppointmentsPage(
    {
      to: getStartOfToday(),
      status: VISIBLE_APPOINTMENTS_STATUS,
      order: HealthDirectorateAppointmentsOrder.DESC,
      limit: PAGE_SIZE,
    },
    !pastTabVisited || !hasPastAppointmentsAccess,
  )

  const renderAppointmentList = (
    query: ReturnType<typeof useAppointmentsPage>,
    emptyText: string,
    muted?: boolean,
  ) => {
    const { appointments } = query
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
        {query.hasNextPage && (
          <Box display="flex" justifyContent="center" marginTop={3}>
            <Button
              onClick={query.loadMore}
              loading={query.loadingMore}
              variant="ghost"
              size="small"
            >
              {`${formatMessage(m.fetchMore)} ${appointments.length}/${
                query.totalCount
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
