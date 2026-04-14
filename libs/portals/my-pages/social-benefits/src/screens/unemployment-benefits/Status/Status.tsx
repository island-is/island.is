import { IntroWrapperV2, useIsMobile } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { useGetUnemploymentApplicationOverviewQuery } from './Status.generated'

import {
  ActionCard,
  Box,
  Button,
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
  const actionButtons = [
    {
      key: 'contact',
      icon: 'open' as const,
      label: formatMessage(um.statusContactUs),
      href: formatMessage(um.statusContactUsUrl),
      visible: availableActions?.canContact !== false,
    },
    {
      key: 'submit',
      icon: 'documents' as const,
      label: formatMessage(um.statusSubmitDocuments),
      href: formatMessage(um.statusSubmitDocumentsUrl),
      visible: availableActions?.canSubmitDocuments !== false,
    },
    {
      key: 'income',
      icon: 'wallet' as const,
      label: formatMessage(um.statusReportIncome),
      href: formatMessage(um.statusReportIncomeUrl),
      visible: availableActions?.canReportWork !== false,
    },
    {
      key: 'travel',
      icon: 'airplane' as const,
      label: formatMessage(um.statusReportTravel),
      href: formatMessage(um.statusReportTravelUrl),
      visible: availableActions?.canReportTravel !== false,
    },
    {
      key: 'unsubscribe',
      icon: 'logOut' as const,
      label: formatMessage(um.statusUnsubscribe),
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
      {/* Desktop Buttons: flex row, natural width, wraps to next row, all buttons same height */}
      {!loading && (
        <Box
          display={['none', 'none', 'none', 'flex']}
          flexWrap="wrap"
          columnGap={2}
          rowGap={2}
          alignItems="stretch"
          marginBottom={4}
        >
          {actionButtons.map(({ key, icon, label, href }) => (
            <a key={key} href={href} target="_blank" rel="noreferrer">
              <Button
                as="span"
                unfocusable
                variant="utility"
                size="small"
                icon={icon}
                iconType="outline"
              >
                {label}
              </Button>
            </a>
          ))}
        </Box>
      )}
      {/* Mobile Buttons: wrapping row, buttons share space on each row */}
      {!loading && (
        <Box
          display={['flex', 'flex', 'flex', 'none']}
          flexWrap="wrap"
          columnGap={2}
          rowGap={2}
          alignItems="stretch"
          marginTop={4}
          marginBottom={4}
        >
          {actionButtons.map(({ key, icon, label, href }) => (
            <Box key={key} flexGrow={1} display="flex" alignItems="stretch">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', width: '100%' }}
              >
                <Button
                  as="span"
                  unfocusable
                  variant="utility"
                  size="small"
                  icon={icon}
                  iconType="outline"
                  fluid
                >
                  {label}
                </Button>
              </a>
            </Box>
          ))}
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
