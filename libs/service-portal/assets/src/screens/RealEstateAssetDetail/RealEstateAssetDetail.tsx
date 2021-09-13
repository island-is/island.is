import React from 'react'
import chunk from 'lodash/chunk'
import { useParams } from 'react-router-dom'
import { format as formatKennitala } from 'kennitala'
import { defineMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  IntroHeader,
} from '@island.is/service-portal/core'
import TableUnits from '../../components/TableUnits'
import AssetGrid from '../../components/AssetGrid'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import { Fasteign } from '../../types/RealEstateAssets.types'
import amountFormat from '../../utils/amountFormat'

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

  const owners = assetData?.thinglystirEigendur?.map((owner) => {
    return [
      owner.nafn || '',
      formatKennitala(owner.kennitala) || '',
      owner.heimild || '',
      owner.display || '',
      'NOT AVAILABLE',
    ]
  })

  const units = assetData?.notkunareiningar?.data?.map((unit) => {
    return {
      header: {
        title: 'Notkunareiningar',
        value: unit.stadfang.display || '',
      },
      rows: chunk(
        [
          {
            title: 'Notkunareiningarnúmer',
            value: unit.notkunareininganr || '',
          },
          {
            title: 'Gildandi fasteignamat',
            value: amountFormat(unit.fasteignamat.gildandi) || '',
          },
          {
            title: 'Staðfang',
            value: unit.stadfang.displayShort || '',
          },
          {
            title: 'Fyrirhugað fasteignamat 2022',
            value: unit.fasteignamat.fyrirhugad
              ? amountFormat(unit.fasteignamat.fyrirhugad)
              : '',
          },
          {
            title: 'Merking',
            value: unit.merking || '',
          },
          // {
          //   title: 'Húsmat',
          //   value: unit.husmat?! || '',
          // },
          {
            title: 'Sveitarfélag',
            value: unit.stadfang.sveitarfelag || '',
          },
          {
            title: 'Lóðarmat',
            value: unit.lodarmat ? amountFormat(unit.lodarmat) : '',
          },
          {
            title: 'Notkun',
            value: unit.notkun || '',
          },
          {
            title: 'Brunabótamat',
            value: unit.brunabotamat ? amountFormat(unit.brunabotamat) : '',
          },
          {
            title: 'Starfsemi',
            value: unit.starfsemi || '',
          },
        ],
        2,
      ),
    }
  })

  console.log('units', units)

  console.log('data', data)
  console.log('idididididididid', id)
  const displayOwners = owners || [[]]
  if (!id || error) {
    return <span>Show error</span>
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
              rows: displayOwners,
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
