import {
  IntroWrapper,
  m as coreMessages,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { activationAllowanceMessages as am } from '../../../lib/messages/'
import {
  useGetApplicantAvailableActionsQuery,
  useGetActivationAllowanceApplicationOverviewQuery,
} from './Status.generated'

import { Box, SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { OverviewTable } from '../../../components/shared/OverviewTable'
import { ApplicantOverview } from './ApplicantOverview'
import { Problem } from '@island.is/react-spa/shared'
import { ActionButtons } from '../../unemployment-benefits/components/ActionButtons'

// Virknistyrkur – Staðan þín
const Status = () => {
  useNamespaces('sp.social-benefits-activation-allowance')
  const { formatMessage, locale } = useLocale()
  const { isMobile } = useIsMobile()
  const { data, loading, error } =
    useGetActivationAllowanceApplicationOverviewQuery({
      variables: { locale },
    })
  const { data: actionsData, loading: actionsLoading } =
    useGetApplicantAvailableActionsQuery()

  const overview = data?.vmstApplicationsActivationGrantApplicationOverview
  const availableActions = actionsData?.vmstApplicantAvailableActions
  const hasData = !!overview?.activationGrantApplicationId

  if (!loading && error) {
    return (
      <IntroWrapper
        title={formatMessage(am.title)}
        serviceProvider={{
          slug: 'vinnumalastofnun',
          tooltip: formatMessage(am.tooltip),
        }}
      >
        <Problem error={error} />
      </IntroWrapper>
    )
  }

  if (!loading && !hasData) {
    return (
      <IntroWrapper
        title={formatMessage(am.title)}
        serviceProvider={{
          slug: 'vinnumalastofnun',
          tooltip: formatMessage(am.tooltip),
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
      title={formatMessage(am.title)}
      intro={formatMessage(am.intro)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: formatMessage(am.tooltip),
      }}
      loading={loading}
    >
      {actionsLoading ? (
        <Box marginBottom={4}>
          <SkeletonLoader height={32} width={200} />
        </Box>
      ) : (
        <ActionButtons
          availableActions={availableActions ?? undefined}
          loading={actionsLoading}
        />
      )}
      <Tabs
        label={formatMessage(am.title)}
        contentBackground="white"
        onlyRenderSelectedTab
        selected="application"
        tabs={[
          {
            id: 'application',
            label: formatMessage(
              isMobile
                ? am.statusTabApplicationMobile
                : am.statusTabApplication,
            ),
            content: loading ? (
              <Box paddingTop={4}>
                <SkeletonLoader repeat={5} space={2} />
              </Box>
            ) : (
              <OverviewTable
                overviewItems={overview?.overviewItems ?? []}
                applicationStatusName={overview?.applicationStatusName}
                applicationStatus={overview?.applicationStatus}
              />
            ),
          },
          {
            id: 'applicant',
            label: formatMessage(
              isMobile ? am.statusTabApplicantMobile : am.statusTabApplicant,
            ),
            content: <ApplicantOverview />,
          },
        ]}
      />
    </IntroWrapper>
  )
}

export default Status
