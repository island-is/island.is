import { IntroWrapperV2, useIsMobile } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { useGetUnemploymentApplicationOverviewQuery } from './Status.generated'

import {
  ActionCard,
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

  return (
    <IntroWrapperV2
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
      {!loading && availableActions?.canConfirmJobSearch === true && (
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
            ) : error ? (
              <Box marginTop={2}>
                <Problem error={error} noBorder={false} />
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
    </IntroWrapperV2>
  )
}

export default Status
