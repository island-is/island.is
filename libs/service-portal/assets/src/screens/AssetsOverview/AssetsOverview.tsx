import React from 'react'
import { defineMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import { AlertBanner,Box } from '@island.is/island-ui/core'
import { useLocale,useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { AssetCardLoader } from '../../components/AssetCardLoader'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import AssetListCards from '../../components/AssetListCards'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'

const GetRealEstateQuery = gql`
  query GetRealEstateQuery($input: GetMultiPropertyInput!) {
    assetsOverview(input: $input) {
      properties {
        propertyNumber
        defaultAddress {
          locationNumber
          postNumber
          municipality
          propertyNumber
          display
          displayShort
        }
      }
      paging {
        page
        pageSize
        totalPages
        offset
        total
        hasPreviousPage
        hasNextPage
      }
    }
  }
`

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()

  const { loading, error, data, fetchMore } = useQuery<Query>(
    GetRealEstateQuery,
    {
      variables: { input: { cursor: '1' } },
    },
  )
  const assetData = data?.assetsOverview || {}

  const paginate = () => {
    const fasteignirArray = assetData?.properties || []
    if (fetchMore && fasteignirArray.length > 0) {
      fetchMore({
        variables: {
          input: {
            cursor: Math.ceil(
              fasteignirArray.length / DEFAULT_PAGING_ITEMS + 1,
            ).toString(),
          },
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult

          if (
            fetchMoreResult?.assetsOverview?.properties &&
            prevResult.assetsOverview?.properties
          ) {
            fetchMoreResult.assetsOverview.properties = [
              ...prevResult.assetsOverview?.properties,
              ...fetchMoreResult.assetsOverview?.properties,
            ]
          }
          return fetchMoreResult
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
              'Hér birtast upplýsingar úr fasteignaskrá Þjóðskrár um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að.',
          })}
        />
      </Box>
      {loading && <AssetCardLoader />}
      {data && (
        <AssetListCards paginateCallback={paginate} assets={assetData} />
      )}

      {!loading &&
        !error &&
        assetData?.properties &&
        assetData?.properties?.length === 0 && (
          <Box marginTop={8}>
            <EmptyState title={m.noDataFound} />
          </Box>
        )}

      {error && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        </Box>
      )}
    </>
  )
}

export default AssetsOverview
