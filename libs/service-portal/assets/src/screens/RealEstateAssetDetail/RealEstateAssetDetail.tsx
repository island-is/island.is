import React from 'react'
import { useParams } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import { useQuery, useLazyQuery } from '@apollo/client'
import { Query, PropertyOwner } from '@island.is/api/schema'
import { useNamespaces, useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  IntroHeader,
  NotFound,
} from '@island.is/service-portal/core'
import TableUnits from '../../components/TableUnits'
import AssetGrid from '../../components/AssetGrid'
import AssetLoader from '../../components/AssetLoader'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import amountFormat from '../../utils/amountFormat'
import { ownersArray } from '../../utils/createUnits'
import { messages } from '../../lib/messages'
import {
  GET_SINGLE_PROPERTY_QUERY,
  GET_PROPERTY_OWNERS_QUERY,
} from '../../lib/queries'
import DetailHeader from '../../components/DetailHeader'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()
  const { id }: { id: string | undefined } = useParams()

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

  if (!id || error) {
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.assets',
          defaultMessage: 'Fasteign fannst ekki',
        })}
      />
    )
  }

  console.log('assetData', assetData)
  const test = {
    fasteignanumer: 'F2084803',
    sjalfgefidStadfang: {
      stadfanganumer: 1033382,
      landeignarnumer: 125400,
      postnumer: 270,
      sveitarfelagBirting: 'Mosfellsbær',
      birting: 'Reykjalundur, 270 Mosfellsbær',
      birtingStutt: 'Reykjalundur',
    },
    fasteignamat: {
      gildandiFasteignamat: 1,
      fyrirhugadFasteignamat: 1,
      gildandiMannvirkjamat: 1,
      fyrirhugadMannvirkjamat: 1,
      gildandiLodarhlutamat: 147450000,
      fyrirhugadLodarhlutamat: 151150000,
      gildandiAr: 2021,
      fyrirhugadAr: 2022,
    },
    thinglystirEigendur: {
      thinglystirEigendur: [
        {
          nafn: 'Gervimaður Bandaríkin          ',
          kennitala: '1',
          eignarhlutfall: 1,
          kaupdagur: '1944-05-30T00:00:00.000Z',
          heimildBirting: 'Fleiri en ein eignarheimild',
        },
      ],
    },
    notkunareiningar: {
      notkunareiningar: [
        {
          notkunareininganumer: '2084803',
          fasteignanumer: '2084803',
          merking: '010101',
          notkunBirting: 'Vistheimili',
          skyring: 'Vistheimili',
          byggingararBirting: '1944-2000',
          birtStaerd: 20613.6,
          fasteignamat: {
            gildandiFasteignamat: 1,
            fyrirhugadFasteignamat: 1,
            gildandiMannvirkjamat: 1,
            fyrirhugadMannvirkjamat: 1,
            gildandiLodarhlutamat: 147450000,
            fyrirhugadLodarhlutamat: 151150000,
            gildandiAr: 2021,
            fyrirhugadAr: 2022,
          },
          brunabotamat: 1,
        },
      ],
    },
  }
  const paginateOwners =
    ownersQuery?.data?.assetsPropertyOwners.paging?.hasNextPage ||
    (assetData.registeredOwners?.paging?.hasNextPage &&
      !ownersQuery?.data?.assetsPropertyOwners?.paging)
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
          img="./assets/images/sofa.svg"
          hideImgPrint
        />
      </Box>
      <DetailHeader
        title={`${assetData?.defaultAddress?.displayShort} - ${assetData?.propertyNumber}`}
      />
      <Box>
        <TableUnits
          paginateCallback={() => paginate()}
          tables={[
            {
              header: [
                formatMessage(messages.legalOwners),
                formatMessage(messages.ssn),
                formatMessage(messages.authorization),
                formatMessage(messages.holdings),
                formatMessage(messages.purchaseDate),
              ],
              rows: owners,
              paginate: paginateOwners,
            },
            {
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
                    ? amountFormat(assetData.appraisal?.plannedAppraisal)
                    : '',
                ],
              ],
            },
          ]}
        />
      </Box>
      <Box marginTop={7}>
        {assetData?.unitsOfUse?.unitsOfUse &&
        assetData?.unitsOfUse?.unitsOfUse?.length > 0 ? (
          <AssetGrid
            title={formatMessage(messages.unitsOfUse)}
            locationData={assetData?.defaultAddress}
            units={assetData?.unitsOfUse}
            assetId={assetData?.propertyNumber}
          />
        ) : null}
      </Box>
      <Box marginTop={8}>
        <AssetDisclaimer />
      </Box>
    </>
  )
}

export default AssetsOverview
