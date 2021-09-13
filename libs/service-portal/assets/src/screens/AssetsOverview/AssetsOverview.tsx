import React from 'react'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  IntroHeader,
} from '@island.is/service-portal/core'
import AssetListCards from '../../components/AssetListCards'
import AssetDisclaimer from '../../components/AssetDisclaimer'

const GetRealEstateQuery = gql`
  query GetRealEstateQuery {
    getRealEstate
  }
`

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')

  const { loading, error, ...statusQuery } = useQuery<Query>(GetRealEstateQuery)
  const assetData: any = statusQuery.data?.getRealEstate || {}

  console.log('assetData', assetData)

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
      <AssetListCards />
      <AssetDisclaimer />
    </>
  )
}

export default AssetsOverview
