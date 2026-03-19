import { Box, Button, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapperV2 } from '@island.is/portals/my-pages/core'
import { moduleMessages as m } from '../../lib/messages'

// Atvinnuleysi – Staðan þín
// TODO: Wire up to a real unemployment status API query and render actual data.
const UnemploymentStatus = () => {
  useNamespaces('sp.support-maintenance')
  const { formatMessage } = useLocale()

  const actionButtons = [
    {
      key: 'contact',
      icon: 'open' as const,
      label: formatMessage(m.unemploymentStatusContactUs),
    },
    {
      key: 'submit',
      icon: 'document' as const,
      label: formatMessage(m.unemploymentStatusSubmitDocuments),
    },
    {
      key: 'income',
      icon: 'receipt' as const,
      label: formatMessage(m.unemploymentStatusReportIncome),
    },
    {
      key: 'travel',
      icon: 'airplane' as const,
      label: formatMessage(m.unemploymentStatusReportTravel),
    },
    {
      key: 'unsubscribe',
      icon: 'logOut' as const,
      label: formatMessage(m.unemploymentStatusUnsubscribe),
    },
  ]

  return (
    <IntroWrapperV2
      title={formatMessage(m.unemploymentStatusTitle)}
      intro={formatMessage(m.unemploymentStatusDescription)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: 'TODO Add tooltip',
      }}
      marginBottom={4}
      loading={false}
    >
      {/* Desktop: flex row, natural width, wraps to next row, all buttons same height */}
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
      {/* Mobile: wrapping row, buttons share space on each row */}
      <Box
        display={['flex', 'flex', 'none']}
        flexWrap="wrap"
        columnGap={2}
        rowGap={2}
        alignItems="stretch"
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
        label={formatMessage(m.unemploymentStatusTitle)}
        contentBackground="white"
        tabs={[
          {
            label: formatMessage(m.unemploymentStatusTabApplication),
            content: null,
          },
          {
            label: formatMessage(m.unemploymentStatusTabApplicant),
            content: null,
          },
        ]}
      />
    </IntroWrapperV2>
  )
}

export default UnemploymentStatus
