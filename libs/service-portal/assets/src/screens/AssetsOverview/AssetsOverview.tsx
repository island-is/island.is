import React from 'react'
import { defineMessage } from 'react-intl'
import { useNamespaces, useLocale } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, AlertBanner } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import AssetListCards from '../../components/AssetListCards'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import { FasteignirResponse } from '../../types/RealEstateAssets.types'
import { AssetCardLoader } from '../../components/AssetCardLoader'

const GetRealEstateQuery = gql`
  query GetRealEstateQuery {
    getRealEstates
  }
`

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useQuery<Query>(GetRealEstateQuery)
  const assetData: FasteignirResponse = data?.getRealEstates || {}

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage({
            id: 'sp.assets:title',
            defaultMessage: 'Fasteignir',
          })}
          intro={defineMessage({
            id: 'sp.assets:intro',
            defaultMessage:
              'Hér færðu upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert skráður eigandi að.',
          })}
          img="./assets/images/educationGrades.svg"
        />
      </Box>
      {loading && <AssetCardLoader />}
      {data && <AssetListCards assets={assetData.fasteignir} />}
      {error && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        </Box>
      )}
      <AssetDisclaimer />
    </>
  )
}

export default AssetsOverview
