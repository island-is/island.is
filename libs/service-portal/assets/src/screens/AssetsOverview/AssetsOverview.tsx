import React from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  pagingFragment,
  addressFragment,
} from '@island.is/service-portal/graphql'
import { Query } from '@island.is/api/schema'
import { Box, Button, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  FootNote,
  HMS_ID,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'

import { AssetCardLoader } from '../../components/AssetCardLoader'
import AssetListCards from '../../components/AssetListCards'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'

const GetRealEstateQuery = gql`
  query GetRealEstateQuery($input: GetMultiPropertyInput!) {
    assetsOverview(input: $input) {
      properties {
        propertyNumber
        defaultAddress {
          ...Address
        }
      }
      paging {
        ...Paging
      }
    }
  }
  ${pagingFragment}
  ${addressFragment}
`

export const AssetsOverview = () => {
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
              ...(prevResult.assetsOverview?.properties ?? []),
              ...(fetchMoreResult.assetsOverview?.properties ?? []),
            ]
          }
          return fetchMoreResult
        },
      })
    }
  }

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.realEstate).toLowerCase(),
        })}
      />
    )
  }

  return (
    <>
      <IntroHeader
        title={{
          id: 'sp.assets:title',
          defaultMessage: 'Fasteignir',
        }}
        intro={{
          id: 'sp.assets:intro',
          defaultMessage:
            'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að.',
        }}
        serviceProviderID={HMS_ID}
        serviceProviderTooltip={formatMessage(m.realEstateTooltip)}
      />

      {loading && <AssetCardLoader />}
      {assetData?.properties && assetData?.properties?.length > 0 && (
        <>
          <GridRow>
            <GridColumn span="1/1">
              <Box
                display="flex"
                justifyContent="flexStart"
                printHidden
                height="full"
                marginBottom={4}
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
          <AssetListCards paginateCallback={paginate} assets={assetData} />
        </>
      )}

      {!loading &&
        !error &&
        assetData?.properties &&
        assetData?.properties?.length === 0 && (
          <Box marginTop={[0, 8]}>
            <EmptyState />
          </Box>
        )}
      <FootNote serviceProviderID={HMS_ID} />
    </>
  )
}

export default AssetsOverview
