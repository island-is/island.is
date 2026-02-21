import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { ATVINNUVEGARADUNEYTID_SLUG } from '@island.is/portals/my-pages/core'
import { farmerLandsMessages } from '../../../lib/messages'
import { useFarmerLandsOverviewQuery } from './FarmerLandsOverview.generated'

export const FarmerLandsOverview = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useFarmerLandsOverviewQuery()

  return (
    <IntroWrapper
      title={formatMessage(farmerLandsMessages.title)}
      intro={formatMessage(farmerLandsMessages.description)}
      serviceProviderSlug={ATVINNUVEGARADUNEYTID_SLUG}
    >
      {loading && <p>Loading...</p>}
      {error && <p>Error loading farmer lands</p>}
      {data?.farmerLands && (
        <div>
          <p>Hello World - {data.farmerLands.totalCount} farmer lands</p>
          <ul>
            {data.farmerLands.data.map((farmerLand) => (
              <li key={farmerLand.id}>{farmerLand.name}</li>
            ))}
          </ul>
        </div>
      )}
    </IntroWrapper>
  )
}

export default FarmerLandsOverview
