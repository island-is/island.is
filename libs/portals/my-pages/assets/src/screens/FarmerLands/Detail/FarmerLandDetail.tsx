import { Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapperV2,
  ATVINNUVEGARADUNEYTID_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { farmerLandsMessages as fm } from '../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useFarmerLandDetailQuery } from './FarmerLandDetail.generated'
import RightsHolders from './RightsHolders/RightHolders'
import LandRegistry from './LandRegistry/LandRegistry'
import Subsidies from './Subsidies/Subsidies'

export const FarmerLandDetail = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useFarmerLandDetailQuery({
    variables: { id: id ?? '' },
    skip: !id,
  })

  const land = data?.farmerLand

  const tabs = [
    {
      label: formatMessage(fm.tabRightsHolders),
      content: (
        <RightsHolders
          beneficiaries={land?.beneficiaries ?? []}
          loading={loading}
          error={!!error}
        />
      ),
    },
    {
      label: formatMessage(fm.tabLandRegistry),
      content: (
        <LandRegistry
          landRegistry={land?.landRegistry ?? []}
          loading={loading}
          error={!!error}
        />
      ),
    },
    {
      label: formatMessage(fm.tabSubsidies),
      content: <Subsidies />,
    },
  ]

  return (
    <IntroWrapperV2
      title={land?.name ? { defaultMessage: land.name } : fm.title}
      intro={fm.description}
      serviceProvider={{ slug: ATVINNUVEGARADUNEYTID_SLUG }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && (
        <Tabs
          label={formatMessage(fm.selectTab)}
          tabs={tabs}
          contentBackground="transparent"
          selected="0"
          size="xs"
        />
      )}
    </IntroWrapperV2>
  )
}

export default FarmerLandDetail
