import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Tabs, Text } from '@island.is/island-ui/core'
import {
  IntroWrapper,
  m,
  SAMGONGUSTOFA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Markdown } from '@island.is/shared/components'
import { olMessage as om } from '../../../lib/messages'
import { SeagoingTime } from './SeagoingTime/SeagoingTime'
import { Exemptions } from './Exemptions/Exemptions'
import { SeaServiceBooks } from './SeaServiceBooks/SeaServiceBooks'

const LegalRegistrations = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={m.sailorsCrewRegistrationsTitle}
      introComponent={
        <Text variant="default">
          <Markdown>{formatMessage(om.sailorCrewRegistrationsIntro)}</Markdown>
        </Text>
      }
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      <Box marginBottom={5}>
        <Tabs
          label={formatMessage(om.sailorCrewRegistrationsTabsLabel)}
          contentBackground="white"
          selected="seagoing-service"
          onlyRenderSelectedTab
          tabs={[
            {
              id: 'seagoing-service',
              label: formatMessage(om.sailorTabSeaService),
              content: (
                <Box marginTop={6}>
                  <SeagoingTime />
                </Box>
              ),
            },
            {
              id: 'exemptions',
              label: formatMessage(om.sailorTabExemptions),
              content: (
                <Box marginTop={6}>
                  <Exemptions />
                </Box>
              ),
            },
            {
              id: 'sea-service-books',
              label: formatMessage(om.sailorTabSeaServiceBooks),
              content: (
                <Box marginTop={6}>
                  <SeaServiceBooks />
                </Box>
              ),
            },
          ]}
        />
      </Box>
    </IntroWrapper>
  )
}

export default LegalRegistrations
