import { useParams } from 'react-router-dom'
import {
  unitsOfUseFragment,
  pagingFragment,
  appraisalFragment,
  addressFragment,
} from '@island.is/portals/my-pages/graphql'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { Query, PropertyOwner } from '@island.is/api/schema'
import { useNamespaces, useLocale } from '@island.is/localization'
import { Box, Button } from '@island.is/island-ui/core'
import {
  amountFormat,
  HMS_SLUG,
  IntroHeader,
  m,
} from '@island.is/portals/my-pages/core'
import AssetGrid from '../../components/AssetGrid'
import AssetLoader from '../../components/AssetLoader'
import { ownersArray } from '../../utils/createUnits'
import { messages } from '../../lib/messages'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'
import { TableGrid, TableUnits } from '@island.is/portals/my-pages/core'
import { FootNote } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

export const ownerFragment = gql`
  fragment Owner on PropertyOwner {
    name
    ssn
    ownership
    purchaseDate
    grantDisplay
  }
`

export const GET_PROPERTY_OWNERS_QUERY = gql`
  query GetAssetsPropertyOwners($input: GetPagingTypes!) {
    assetsPropertyOwners(input: $input) {
      registeredOwners {
        ...Owner
      }
      paging {
        ...Paging
      }
    }
  }
  ${pagingFragment}
  ${ownerFragment}
`

export const GET_SINGLE_PROPERTY_QUERY = gql`
  query GetSingleRealEstateQuery($input: GetRealEstateInput!) {
    assetsDetail(input: $input) {
      propertyNumber
      defaultAddress {
        ...Address
      }
      appraisal {
        ...Appraisal
      }
      registeredOwners {
        registeredOwners {
          ...Owner
        }
      }
      land {
        landNumber
        landAppraisal
        useDisplay
        area
        areaUnit
      }
      unitsOfUse {
        unitsOfUse {
          ...unitsOfUse
        }
      }
    }
  }
  ${unitsOfUseFragment}
  ${ownerFragment}
  ${appraisalFragment}
  ${addressFragment}
`

type UseParams = {
  id: string
}

export const AssetsDetail = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { loading, error, data } = useQuery<Query>(GET_SINGLE_PROPERTY_QUERY, {
    variables: {
      input: {
        assetId: id,
      },
    },
  })
  const assetData = data?.assetsDetail || {}

  const [
    getOwnersQuery,
    { loading: ownerLoading, error: ownerError, fetchMore, ...ownersQuery },
  ] = useLazyQuery(GET_PROPERTY_OWNERS_QUERY)
  const eigendurPaginationData: PropertyOwner[] =
    ownersQuery?.data?.assetsPropertyOwners?.registeredOwners || []

  const assetOwners = assetData.registeredOwners?.registeredOwners || []

  const combinedOwnerArray = [...assetOwners, ...eigendurPaginationData]

  const owners = ownersArray(combinedOwnerArray)

  const paginate = () => {
    const variableObject = {
      variables: {
        input: {
          assetId: assetData?.propertyNumber,
          cursor: Math.ceil(
            eigendurPaginationData.length / DEFAULT_PAGING_ITEMS + 1,
          ).toString(),
        },
      },
    }

    if (fetchMore) {
      fetchMore({
        ...variableObject,
        updateQuery: (prevResult, { fetchMoreResult }) => {
          fetchMoreResult.assetsPropertyOwners.thinglystirEigendur = [
            ...prevResult.assetsPropertyOwners.thinglystirEigendur,
            ...fetchMoreResult.assetsPropertyOwners.thinglystirEigendur,
          ]
          return fetchMoreResult
        },
      })
    } else {
      getOwnersQuery(variableObject)
    }
  }

  if (loading) {
    return <AssetLoader />
  }

  const paginateOwners =
    ownersQuery?.data?.assetsPropertyOwners.paging?.hasNextPage ||
    (assetData.registeredOwners?.paging?.hasNextPage &&
      !ownersQuery?.data?.assetsPropertyOwners?.paging)

  const hasOwners = owners?.flat()?.length > 0

  const title: string =
    assetData?.defaultAddress?.displayShort && assetData?.propertyNumber
      ? `${assetData?.defaultAddress?.displayShort} - ${assetData?.propertyNumber}`
      : formatMessage(messages.realEstate)

  return (
    <>
      <IntroHeader
        title={title}
        intro={formatMessage(messages.realEstateDetailIntro)}
        serviceProviderSlug={'hms'}
        serviceProviderTooltip={formatMessage(m.realEstateTooltip)}
      >
        <Box marginTop={4}>
          <Button
            colorScheme="default"
            icon="print"
            iconType="filled"
            onClick={() => window.print()}
            preTextIconType="filled"
            size="default"
            type="button"
            variant="utility"
          >
            {formatMessage(m.print)}
          </Button>
        </Box>
      </IntroHeader>
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !data?.assetsDetail && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noDataFoundVariable, {
            arg: formatMessage(messages.realEstate).toLowerCase(),
          })}
          message={formatMessage(m.noDataFoundVariableDetail, {
            arg: formatMessage(messages.realEstate).toLowerCase(),
          })}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && !loading && data?.assetsDetail && (
        <>
          <Box>
            <TableUnits
              paginateCallback={() => paginate()}
              tables={[
                hasOwners
                  ? {
                      header: [
                        formatMessage(messages.legalOwners),
                        formatMessage(messages.ssn),
                        formatMessage(messages.authorization),
                        formatMessage(messages.holdings),
                        formatMessage(messages.purchaseDate),
                      ],
                      rows: owners,
                      paginate: paginateOwners,
                    }
                  : null,
                assetData.appraisal
                  ? {
                      header: [
                        `${formatMessage(messages.appraisal)} ${
                          assetData.appraisal?.activeYear
                        }`,
                        `${formatMessage(messages.appraisal)} ${
                          assetData.appraisal?.plannedYear
                        }`,
                      ],
                      rows: [
                        [
                          assetData.appraisal?.activeAppraisal
                            ? amountFormat(assetData.appraisal?.activeAppraisal)
                            : '',
                          assetData.appraisal?.plannedAppraisal
                            ? amountFormat(
                                assetData.appraisal?.plannedAppraisal,
                              )
                            : '',
                        ],
                      ],
                    }
                  : null,
              ]}
            />
          </Box>
          {assetData.land?.landNumber && (
            <TableGrid
              title={formatMessage(messages.land)}
              mt
              dataArray={[
                [
                  {
                    title: formatMessage(messages.usage),
                    value: assetData.land?.useDisplay ?? '',
                  },
                  {
                    title: formatMessage(messages.landSize),
                    value: assetData.land?.area
                      ? `${assetData.land?.area} ${assetData.land?.areaUnit}`
                      : '',
                  },
                ],
                [
                  {
                    title: formatMessage(messages.landNumber),
                    value: assetData.land?.landNumber,
                  },
                  {
                    title: formatMessage(messages.landAppraisal),
                    value: assetData.land?.landAppraisal
                      ? amountFormat(assetData.land?.landAppraisal)
                      : '',
                  },
                ],
              ]}
            />
          )}
          <Box marginTop={7}>
            {assetData?.unitsOfUse?.unitsOfUse &&
              assetData?.unitsOfUse?.unitsOfUse?.length > 0 && (
                <AssetGrid
                  title={formatMessage(messages.unitsOfUse)}
                  locationData={assetData?.defaultAddress}
                  units={assetData?.unitsOfUse}
                  assetId={assetData?.propertyNumber}
                />
              )}
          </Box>
          <Box marginTop={8}>
            <FootNote
              notes={[
                { text: formatMessage(messages.disclaimerA) },
                { text: formatMessage(messages.disclaimerB) },
              ]}
              serviceProviderSlug={HMS_SLUG}
            />
          </Box>
        </>
      )}
    </>
  )
}

export default AssetsDetail
