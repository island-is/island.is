import { Box, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  SAMGONGUSTOFA_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'

import VehicleSearch from './components/SimpleVehicleSearch'
import DetailedVehicleSearch from './components/DetailedVehicleSearch'

import { vehicleMessage as messages } from '../../lib/messages'

const Lookup = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <IntroWrapper
      title={messages.vehiclesLookup}
      intro={messages.searchIntro}
      serviceProviderSlug={SAMGONGUSTOFA_SLUG}
      serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
    >
      <Tabs
        contentBackground="white"
        label={formatMessage(messages.vehiclesLookup)}
        tabs={[
          {
            label: formatMessage(messages.simpleSearchTab),
            content: (
              <Box marginTop={4} marginBottom={[2, 3, 5]}>
                <VehicleSearch />
              </Box>
            ),
          },
          {
            label: formatMessage(messages.detailedSearchTab),
            content: <DetailedVehicleSearch />,
          },
        ]}
      />
    </IntroWrapper>
  )
}

export default Lookup
