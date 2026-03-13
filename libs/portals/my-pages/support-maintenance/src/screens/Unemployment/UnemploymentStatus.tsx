import { Box, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapperV2 } from '@island.is/portals/my-pages/core'
import { moduleMessages as m } from '../../lib/messages'

// Atvinnuleysi – Staðan þín
// TODO: Wire up to a real unemployment status API query and render actual data.
const UnemploymentStatus = () => {
  useNamespaces('sp.support-maintenance')
  const { formatMessage } = useLocale()

  return (
    <IntroWrapperV2
      title={formatMessage(m.unemploymentStatusTitle)}
      intro={formatMessage(m.unemploymentStatusDescription)}
    >
      <Box
        background="blue100"
        borderRadius="large"
        padding={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* TODO: Replace with real status data – payment amounts, next payment
            date, benefit period, case status, etc. */}
        <Text variant="h5" color="blue600">
          TODO: Staðan þín – placeholder
        </Text>
      </Box>
    </IntroWrapperV2>
  )
}

export default UnemploymentStatus
