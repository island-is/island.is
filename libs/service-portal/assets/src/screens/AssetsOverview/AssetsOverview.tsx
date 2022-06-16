import React from 'react'
import { defineMessage } from 'react-intl'
import { useNamespaces, useLocale } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Text,
  Button,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  m,
  EmptyState,
} from '@island.is/service-portal/core'
import AssetListCards from '../../components/AssetListCards'
import { AssetCardLoader } from '../../components/AssetCardLoader'
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
      <Text variant="h3" as="h1">
        {formatMessage({
          id: 'sp.assets:title',
          defaultMessage: 'Fasteignir',
        })}
      </Text>
      <GridRow marginBottom={7}>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="default" paddingTop={2}>
            {formatMessage({
              id: 'sp.assets:intro',
              defaultMessage:
                'Hér birtast upplýsingar úr fasteignaskrá Þjóðskrár um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að.',
            })}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box
            display="flex"
            justifyContent="flexEnd"
            alignItems="flexEnd"
            marginTop={2}
            printHidden
            height="full"
          >
            <a
              href="/umsoknir/vedbokarvottord/"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                colorScheme="default"
                icon="document"
                iconType="filled"
                size="default"
                type="button"
                variant="utility"
              >
                {formatMessage(m.mortageCertificate)}
              </Button>
            </a>
          </Box>
        </GridColumn>
      </GridRow>
      {loading && <AssetCardLoader />}
      {data && (
        <AssetListCards paginateCallback={paginate} assets={assetData} />
      )}

      {!loading &&
        !error &&
        assetData?.properties &&
        assetData?.properties?.length === 0 && (
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        )}

      {error && (
        <Box>
          <EmptyState
            description={defineMessage({
              id: 'sp.assets:error-message',
              defaultMessage:
                'Ekki tókst að sækja upplýsingar úr fasteignaskrá.',
            })}
          />
        </Box>
      )}
    </>
  )
}

export default AssetsOverview
