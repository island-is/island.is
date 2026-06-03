import {
  IntroWrapper,
  m as coreMessages,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { useGetUnemploymentApplicationOverviewQuery } from './Status.generated'

import {
  ActionCard,
  AlertMessage,
  Box,
  SkeletonLoader,
  Tabs,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { OverviewTable } from './OverviewTable'
import { ApplicantOverview } from './ApplicantOverview'
import { Problem } from '@island.is/react-spa/shared'
import { ActionButtons } from '../components/ActionButtons'

// Atvinnuleysi – Staðan þín
const Status = () => {
  useNamespaces('sp.social-benefits-unemployment')
  const { formatMessage, locale } = useLocale()
  const { isMobile } = useIsMobile()
  const { data, loading, error } = useGetUnemploymentApplicationOverviewQuery({
    variables: { locale },
  })

  const overview = data?.vmstApplicationsUnemploymentApplicationOverview
  const availableActions = overview?.availableActions
  const jobSearchConfirmationStatus = overview?.jobSearchConfirmationStatus
  const hasData = !!overview?.unemploymentApplicationId

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
      {!loading && jobSearchConfirmationStatus?.canConfirm === true && (
        <Box marginBottom={4}>
          <ActionCard
            heading={formatMessage(um.jobSearchConfirmationHeading)}
            text={formatMessage(um.jobSearchConfirmationText)}
            backgroundColor="blue"
            cta={{
              label: formatMessage(um.jobSearchConfirmationCta),
              variant: 'primary',
              icon: 'open',
              iconType: 'outline',
              onClick: () =>
                window.open(
                  formatMessage(um.jobSearchConfirmationUrl),
                  '_blank',
                  'noopener,noreferrer',
                ),
            }}
          />
        </Box>
      )}
      {!loading && jobSearchConfirmationStatus?.hasConfirmed === true && (
        <Box marginBottom={4}>
          <AlertMessage
            type="success"
            message={formatMessage(
              coreMessages.unemploymentHasConfirmedJobSearch,
            )}
          />
        </Box>
      )}
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
                applicationStatus={overview?.applicationStatus}
                dataRequested={overview?.dataRequested}
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
