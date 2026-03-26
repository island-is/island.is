import { Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapperV2,
  ATVINNUVEGARADUNEYTID_SLUG,
  m as cm,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { farmerLandsMessages as fm } from '../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useFarmerLandDetailQuery } from './FarmerLandDetail.generated'
import RightsHolders from './RightsHolders/RightsHolders'
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
          error={error}
        />
      ),
    },
    {
      label: formatMessage(fm.tabLandRegistry),
      content: (
        <LandRegistry
          landRegistry={land?.landRegistry ?? []}
          loading={loading}
          error={error}
        />
      ),
    },
    {
      label: formatMessage(fm.tabSubsidies),
      content: <Subsidies farmId={id ?? ''} />,
    },
  ]

  return (
    <IntroWrapperV2
      title={land?.name ?? formatMessage(fm.title)}
      intro={fm.description}
      serviceProvider={{
        slug: ATVINNUVEGARADUNEYTID_SLUG,
        tooltip: formatMessage(cm.farmerLandTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && data && !data.farmerLand && (
        <Problem
          type="no_data"
          title={formatMessage(fm.noFarmerLandFound)}
          message={formatMessage(cm.noDataFoundDetail)}
          noBorder={false}
        />
      )}
      {!loading && data?.farmerLand && (
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
