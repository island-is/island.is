import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Tabs } from '@island.is/island-ui/core'
import {
  CardLoader,
  IntroWrapper,
  m,
  SAMGONGUSTOFA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../lib/messages'
import { SailorCrewRegistrationsSeaService } from './SailorCrewRegistrationsSeaService'
import { SailorCrewRegistrationsExemptions } from './SailorCrewRegistrationsExemptions'
import { SailorCrewRegistrationsMaritimeBooks } from './SailorCrewRegistrationsMaritimeBooks'

const SailorCrewRegistrations = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage } = useLocale()

  // TODO: Replace stubs with generated hook when domain module exposes registrationExemptions/maritimeBooks
  const loading = false
  const error = undefined

  return (
    <IntroWrapper
      title={m.sailorsCrewRegistrationsTitle}
      intro={om.sailorCrewRegistrationsIntro}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      <Box marginBottom={5}>
        <Tabs
          label={formatMessage(om.sailorCrewRegistrationsTabsLabel)}
          contentBackground="white"
          tabs={[
            {
              label: formatMessage(om.sailorTabSeaService),
              content: <SailorCrewRegistrationsSeaService />,
            },
            {
              label: formatMessage(om.sailorTabExemptions),
              content: <SailorCrewRegistrationsExemptions />,
            },
            {
              label: formatMessage(om.sailorTabMaritimeBooks),
              content: <SailorCrewRegistrationsMaritimeBooks />,
            },
          ]}
        />
      </Box>
    </IntroWrapper>
  )
}

export default SailorCrewRegistrations
