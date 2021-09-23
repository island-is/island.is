import React from 'react'
import { defineMessage } from 'react-intl'
import { useNamespaces, useLocale } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, AlertBanner } from '@island.is/island-ui/core'
import { FasteignSimpleWrapper } from '@island.is/clients/assets'
import {
  ServicePortalModuleComponent,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import AssetListCards from '../../components/AssetListCards'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import { AssetCardLoader } from '../../components/AssetCardLoader'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'

const GetRealEstateQuery = gql`
  query GetRealEstateQuery($input: GetMultiPropertyInput!) {
    getRealEstates(input: $input)
  }
`

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()

  const { loading, error, data, fetchMore } = useQuery<Query>(
    GetRealEstateQuery,
    {
      variables: { input: { cursor: '0' } },
    },
  )
  const assetData: FasteignSimpleWrapper = data?.getRealEstates || {}

  const paginate = () => {
    const fasteignirArray = assetData?.fasteignir || []
    if (fetchMore) {
      fetchMore({
        variables: {
          input: {
            cursor: Math.ceil(
              fasteignirArray.length / DEFAULT_PAGING_ITEMS,
            ).toString(),
          },
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (fetchMoreResult) {
            fetchMoreResult.getRealEstates.fasteignir = [
              ...prevResult.getRealEstates.fasteignir,
              ...fetchMoreResult.getRealEstates.fasteignir,
            ]
          }
          return fetchMoreResult || prevResult
        },
      })
    }
  }

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
      {data && (
        <AssetListCards paginateCallback={paginate} assets={assetData} />
      )}
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
