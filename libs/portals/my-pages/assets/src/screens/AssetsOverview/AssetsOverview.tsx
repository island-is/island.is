import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, Button, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { HMS_SLUG, IntroWrapper, m } from '@island.is/portals/my-pages/core'
import {
  addressFragment,
  pagingFragment,
} from '@island.is/portals/my-pages/graphql'

import { Problem } from '@island.is/react-spa/shared'
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

  return (
    <IntroWrapper
      title={m.assets}
      intro={{
        id: 'sp.assets:intro',
        defaultMessage:
          'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að.',
      }}
      serviceProviderSlug={HMS_SLUG}
      serviceProviderTooltip={formatMessage(m.realEstateTooltip)}
    >
      {loading && !error && <AssetCardLoader />}
      {error && !loading && <Problem error={error} noBorder={false} />}
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
                    as="span"
                    unfocusable
                    colorScheme="default"
                    icon="document"
                    iconType="filled"
                    size="default"
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
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
    </IntroWrapper>
  )
}

export default AssetsOverview
