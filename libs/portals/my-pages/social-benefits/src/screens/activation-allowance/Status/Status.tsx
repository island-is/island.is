import {
  IntroWrapper,
  m as coreMessages,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import {
  useGetApplicantAvailableActionsQuery,
  useGetUnemploymentApplicationOverviewQuery,
} from './Status.generated'

import { Box, SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { OverviewTable } from './OverviewTable'
import { ApplicantOverview } from './ApplicantOverview'
import { Problem } from '@island.is/react-spa/shared'
import { ActionButtons } from '../../unemployment-benefits/components/ActionButtons'
import { VmstApplicationStatus } from '@island.is/api/schema'

// Atvinnuleysi – Staðan þín
const Status = () => {
  useNamespaces('sp.social-benefits-unemployment')
  const { formatMessage, locale } = useLocale()
  const { isMobile } = useIsMobile()
  const { data, loading, error } = useGetUnemploymentApplicationOverviewQuery({
    variables: { locale },
  })
  // TODO Use the loading state
  const { data: actionsData, loading: actionsLoading } =
    useGetApplicantAvailableActionsQuery()

  const overview = data?.vmstApplicationsActivationGrantApplicationOverview
  const availableActions = actionsData?.vmstApplicantAvailableActions
  const hasData = !!overview?.activationGrantApplicationId

  if (!loading && error) {
    return (
      <IntroWrapper
        title={formatMessage(um.title)}
        serviceProvider={{
          slug: 'vinnumalastofnun',
          tooltip: formatMessage(um.tooltip),
        }}
      >
        <Problem error={error} />
      </IntroWrapper>
    )
  }

  if (!loading && !hasData) {
    return (
      <IntroWrapper
        title={formatMessage(um.title)}
        serviceProvider={{
          slug: 'vinnumalastofnun',
          tooltip: formatMessage(um.tooltip),
        }}
      >
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(coreMessages.noData)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      </IntroWrapper>
    )
  }

  return (
    <IntroWrapper
      title={formatMessage(um.title)}
      intro={formatMessage(um.intro)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: formatMessage(um.tooltip),
      }}
      loading={loading}
    >
      <ActionButtons
        availableActions={availableActions ?? undefined}
        loading={loading}
      />
      <Tabs
        label={formatMessage(um.title)}
        contentBackground="white"
        onlyRenderSelectedTab
        selected="application"
        tabs={[
          {
            id: 'application',
            label: formatMessage(
              isMobile
                ? um.statusTabApplicationMobile
                : um.statusTabApplication,
            ),
            content: loading ? (
              <Box paddingTop={4}>
                <SkeletonLoader repeat={5} space={2} />
              </Box>
            ) : (
              <OverviewTable
                overviewItems={overview?.overviewItems ?? []}
                applicationStatusName={overview?.applicationStatusName}
                applicationStatus={
                  overview?.applicationStatusId as VmstApplicationStatus
                } // TODO REMOVE THIS TYPE ASSERTION AND ASK VMST FOR STATUS INSTEAD OF ID
              />
            ),
          },
          {
            id: 'applicant',
            label: formatMessage(
              isMobile ? um.statusTabApplicantMobile : um.statusTabApplicant,
            ),
            content: <ApplicantOverview />,
          },
        ]}
      />
    </IntroWrapper>
  )
}

export default Status
