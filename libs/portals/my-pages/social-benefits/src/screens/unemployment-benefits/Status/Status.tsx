import { IntroWrapperV2, useIsMobile } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { useGetUnemploymentApplicationOverviewQuery } from './Status.generated'

import { Box, Button, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { OverviewTable } from './OverviewTable'

// Atvinnuleysi – Staðan þín
// TODO: Wire up to a real unemployment status API query and render actual data.
const Status = () => {
  useNamespaces('sp.support-maintenance')
  const { formatMessage, locale } = useLocale()
  const { isMobile } = useIsMobile()
  const { data, loading, error } = useGetUnemploymentApplicationOverviewQuery()

  const overview = data?.vmstApplicationsUnemploymentApplicationOverview

  const actionButtons = [
    {
      key: 'contact',
      icon: 'open' as const,
      label: formatMessage(um.statusContactUs),
    },
    {
      key: 'submit',
      icon: 'document' as const,
      label: formatMessage(um.statusSubmitDocuments),
    },
    {
      key: 'income',
      icon: 'receipt' as const,
      label: formatMessage(um.statusReportIncome),
    },
    {
      key: 'travel',
      icon: 'airplane' as const,
      label: formatMessage(um.statusReportTravel),
    },
    {
      key: 'unsubscribe',
      icon: 'logOut' as const,
      label: formatMessage(um.statusUnsubscribe),
    },
  ]

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
      <Box
        display={['none', 'none', 'flex']}
        flexWrap="wrap"
        columnGap={2}
        rowGap={2}
        alignItems="stretch"
        marginBottom={4}
      >
        {actionButtons.map(({ key, icon, label }) => (
          <Button
            key={key}
            variant="utility"
            size="small"
            icon={icon}
            iconType="outline"
          >
            {label}
          </Button>
        ))}
      </Box>
      {/* Mobile Buttons: wrapping row, buttons share space on each row */}
      <Box
        display={['flex', 'flex', 'none']}
        flexWrap="wrap"
        columnGap={2}
        rowGap={2}
        alignItems="stretch"
        marginTop={4}
        marginBottom={4}
      >
        {actionButtons.map(({ key, icon, label }) => (
          <Box key={key} flexGrow={1} display="flex" alignItems="stretch">
            <Button
              variant="utility"
              size="small"
              icon={icon}
              iconType="outline"
              fluid
            >
              {label}
            </Button>
          </Box>
        ))}
      </Box>
      <Tabs
        label={formatMessage(um.title)}
        contentBackground="white"
        tabs={[
          {
            label: formatMessage(
              isMobile
                ? um.statusTabApplicationMobile
                : um.statusTabApplication,
            ),
            content: (
              <OverviewTable
                rows={overview?.rows ?? []}
                applicationStatusName={overview?.applicationStatusName}
                dataRequested={overview?.dataRequested}
              />
            ),
          },
          {
            label: formatMessage(
              isMobile ? um.statusTabApplicantMobile : um.statusTabApplicant,
            ),
            content: null,
          },
        ]}
      />
    </IntroWrapperV2>
  )
}

export default Status
