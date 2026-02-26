import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapper, SAMGONGUSTOFA_SLUG } from '@island.is/portals/my-pages/core'
import { shipsMessages } from '../../../lib/messages'
import { useShipsOverviewQuery } from './ShipsOverview.generated'

export const ShipsOverview = () => {
  useNamespaces('sp.ships')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useShipsOverviewQuery()

  return (
    <IntroWrapper
      title={formatMessage(shipsMessages.title)}
      intro={formatMessage(shipsMessages.intro)}
      serviceProviderSlug={SAMGONGUSTOFA_SLUG}
      serviceProviderTooltip={formatMessage(shipsMessages.tooltip)}
    >
      {loading && <p>Loading...</p>}
      {error && <p>Error loading ships</p>}
      {data && <p>Hello World</p>}
    </IntroWrapper>
  )
}

export default ShipsOverview
