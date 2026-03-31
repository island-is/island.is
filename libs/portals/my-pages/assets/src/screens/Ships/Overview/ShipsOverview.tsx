import { useNavigate } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard, Stack } from '@island.is/island-ui/core'
import {
  CardLoader,
  EmptyState,
  IntroWrapperV2,
  SAMGONGUSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { shipsMessages } from '../../../lib/messages'
import { AssetsPaths } from '../../../lib/paths'
import { useShipsOverviewQuery } from './ShipsOverview.generated'

export const ShipsOverview = () => {
  useNamespaces('sp.ships')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { data, loading, error } = useShipsOverviewQuery()

  const ships = data?.shipRegistryUserShips?.data

  return (
    <IntroWrapperV2
      title={formatMessage(shipsMessages.title)}
      intro={formatMessage(shipsMessages.intro)}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.shipsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && ships && ships.length === 0 && <EmptyState />}
      {!loading && !error && ships && ships.length > 0 && (
        <Stack space={2}>
          {ships.map((ship) => (
            <ActionCard
              key={ship.id}
              heading={ship.name}
              text={
                ship.regionAcronym
                  ? `${ship.id}, ${ship.regionAcronym}`
                  : ship.id
              }
              tag={
                ship.seaworthiness
                  ? {
                      variant: ship.seaworthiness.isValid ? 'mint' : 'red',
                      outlined: true,
                      label: ship.seaworthiness.isValid
                        ? formatMessage(shipsMessages.validTag)
                        : formatMessage(shipsMessages.invalidTag),
                    }
                  : undefined
              }
              cta={{
                label: formatMessage(shipsMessages.view),
                variant: 'text',
                icon: 'arrowForward',
                onClick: () =>
                  navigate(
                    AssetsPaths.AssetsShipDetail.replace(':id', ship.id),
                  ),
              }}
            />
          ))}
        </Stack>
      )}
    </IntroWrapperV2>
  )
}

export default ShipsOverview
