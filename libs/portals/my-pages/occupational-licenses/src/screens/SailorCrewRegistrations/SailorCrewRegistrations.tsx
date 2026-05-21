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
import { useShipRegistrySailorCertificatesQuery } from '../SailorSchoolCertificates/SailorSchoolCertificates.generated'

const SailorCrewRegistrations = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage } = useLocale()

  const { loading, error } = useShipRegistrySailorCertificatesQuery()

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
      {!loading && !error && (
        <Box marginBottom={5}>
          <Tabs
            label={formatMessage(om.sailorCrewRegistrationsTabsLabel)}
            contentBackground="white"
            tabs={[
              {
                label: formatMessage(om.sailorTabSeaService),
                content: (
                  <Box marginTop={6}>
                    <SailorCrewRegistrationsSeaService />
                  </Box>
                ),
              },
              {
                label: formatMessage(om.sailorTabExemptions),
                content: (
                  <Box marginTop={6}>
                    <SailorCrewRegistrationsExemptions />
                  </Box>
                ),
              },
              {
                label: formatMessage(om.sailorTabMaritimeBooks),
                content: (
                  <Box marginTop={6}>
                    <SailorCrewRegistrationsMaritimeBooks />
                  </Box>
                ),
              },
            ]}
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default SailorCrewRegistrations
