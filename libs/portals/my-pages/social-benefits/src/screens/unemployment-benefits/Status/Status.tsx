import { IntroWrapperV2, useIsMobile } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { useGetUnemploymentApplicationOverviewQuery } from './Status.generated'

import {
  ActionCard,
  Box,
  Button,
  DropdownMenu,
  SkeletonLoader,
  Tabs,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { OverviewTable } from './OverviewTable'
import { ApplicantOverview } from './ApplicantOverview'
import { Problem } from '@island.is/react-spa/shared'

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
  const showContactButton = availableActions?.canContact !== false
  const dropdownActions = [
    {
      title: formatMessage(um.statusSubmitDocuments),
      href: formatMessage(um.statusSubmitDocumentsUrl),
      visible: availableActions?.canSubmitDocuments !== false,
    },
    {
      title: formatMessage(um.statusReportIncome),
      href: formatMessage(um.statusReportIncomeUrl),
      visible: availableActions?.canReportWork !== false,
    },
    {
      title: formatMessage(um.statusReportTravel),
      href: formatMessage(um.statusReportTravelUrl),
      visible: availableActions?.canReportTravel !== false,
    },
    {
      title: formatMessage(um.statusUnsubscribe),
      href: formatMessage(um.statusUnsubscribeUrl),
      visible: availableActions?.canUnregister !== false,
    },
  ].filter((b) => b.visible)

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
      {!loading && (showContactButton || dropdownActions.length > 0) && (
        <Box display="flex" columnGap={2} alignItems="center" marginBottom={4}>
          {showContactButton && (
            <a
              href={formatMessage(um.statusContactUsUrl)}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                as="span"
                unfocusable
                variant="utility"
                size="small"
                icon="open"
                iconType="outline"
              >
                {formatMessage(um.statusContactUs)}
              </Button>
            </a>
          )}
          {dropdownActions.length > 0 && (
            <DropdownMenu
              icon="ellipsisVertical"
              menuLabel={formatMessage(um.statusMoreActions)}
              title={formatMessage(um.statusMoreActions)}
              items={dropdownActions}
            />
          )}
        </Box>
      )}
      {!loading && availableActions?.canConfirmJobSearch !== false && (
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
                applicationStatusId={overview?.applicationStatusId}
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
