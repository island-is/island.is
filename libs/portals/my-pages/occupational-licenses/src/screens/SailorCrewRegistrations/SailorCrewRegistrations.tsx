import { useState } from 'react'
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
import { useShipRegistrySailorCrewRegistrationsQuery } from './SailorCrewRegistrations.generated'

const PAGE_SIZE = 20

const SailorCrewRegistrations = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage } = useLocale()

  const [page, setPage] = useState(1)

  const { data, loading, error } = useShipRegistrySailorCrewRegistrationsQuery({
    variables: { input: { pageNumber: page, pageSize: PAGE_SIZE } },
  })

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
                    <SailorCrewRegistrationsSeaService
                      data={data}
                      loading={loading}
                      error={error}
                      page={page}
                      setPage={setPage}
                      pageSize={PAGE_SIZE}
                    />
                  </Box>
                ),
              },
              {
                label: formatMessage(om.sailorTabExemptions),
                content: (
                  <Box marginTop={6}>
                    <SailorCrewRegistrationsExemptions
                      data={data}
                      loading={loading}
                      error={error}
                    />
                  </Box>
                ),
              },
              {
                label: formatMessage(om.sailorTabMaritimeBooks),
                content: (
                  <Box marginTop={6}>
                    <SailorCrewRegistrationsMaritimeBooks
                      data={data}
                      loading={loading}
                      error={error}
                    />
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
