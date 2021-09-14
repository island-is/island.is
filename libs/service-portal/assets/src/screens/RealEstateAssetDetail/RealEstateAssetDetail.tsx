import React from 'react'
import { useParams } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useNamespaces } from '@island.is/localization'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  IntroHeader,
  NotFound,
} from '@island.is/service-portal/core'
import TableUnits from '../../components/TableUnits'
import AssetGrid from '../../components/AssetGrid'
import AssetLoader from '../../components/AssetLoader'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import { Fasteign } from '../../types/RealEstateAssets.types'
import amountFormat from '../../utils/amountFormat'
import { ownersArray, unitsArray } from '../../utils/createUnits'

const GetSingleRealEstateQuery = gql`
  query GetSingleRealEstateQuery($input: GetRealEstateInput!) {
    getRealEstateDetail(input: $input)
  }
`

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { id }: { id: string | undefined } = useParams()

  const { loading, error, data } = useQuery<Query>(GetSingleRealEstateQuery, {
    variables: {
      input: {
        assetId: id,
      },
    },
  })
  const assetData: Fasteign = data?.getRealEstateDetail || {}

  const owners = ownersArray(assetData)
  const units = unitsArray(assetData)

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
      <Box>
        <TableUnits
          title={`${assetData?.sjalfgefidStadfang?.displayShort} - ${assetData?.fasteignanr}`}
          tables={[
            {
              header: [
                'Þinglýstir eigendur',
                'Kennitala',
                'Heimild',
                'Eignarhlutfall',
                'Staða',
              ],
              rows: owners,
            },
            {
              header: [
                `Gildandi fasteignamat ${assetData.fasteignamat?.gildandiAr}`,
                `Gildandi fasteignamat ${assetData.fasteignamat?.fyrirhugadAr}`,
              ],
              rows: [
                [
                  assetData.fasteignamat?.gildandi
                    ? amountFormat(assetData.fasteignamat?.gildandi)
                    : '',
                  assetData.fasteignamat?.fyrirhugad
                    ? amountFormat(assetData.fasteignamat?.fyrirhugad)
                    : '',
                ],
              ],
            },
          ]}
        />
      </Box>
      <Box marginTop={7}>
        {units && units?.length > 0 ? (
          <AssetGrid title="Notkunareiningar" tables={units} />
        ) : null}
      </Box>
      <Box marginTop={8}>
        <AssetDisclaimer />
      </Box>
    </>
  )
}

export default AssetsOverview
