import React from 'react'
import { defineMessage } from 'react-intl'
import chunk from 'lodash/chunk'
import { useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  IntroHeader,
} from '@island.is/service-portal/core'
import TableUnits from '../../components/TableUnits'
import AssetGrid from '../../components/AssetGrid'
import AssetDisclaimer from '../../components/AssetDisclaimer'

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')

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
          title="Einimelur 24 - F2013002"
          tables={[
            {
              header: [
                'Þinglýstir eigendur',
                'Kennitala',
                'Heimild',
                'Eignarhlutfall',
                'Staða',
              ],
              rows: [
                [
                  'Guðríður Jóna Sigurðardóttir',
                  '220482-4859',
                  'A+',
                  '50,00%',
                  'Þinglýst',
                ],
                [
                  'Guðríður Jóna Sigurðardóttir',
                  '220482-4859',
                  'A+',
                  '50,00%',
                  'Þinglýst',
                ],
              ],
            },
            {
              header: [
                'Gildandi fasteignamat 2021',
                'Gildandi fasteignamat 2023',
              ],
              rows: [['55.400.000 kr.', '59.950.000 kr.']],
            },
          ]}
        />
      </Box>
      <Box marginTop={7}>
        <AssetGrid
          title="Notkunareiningar"
          tables={[
            {
              header: {
                title: 'Notkunareiningar',
                value: 'Einimelur 24, Reykjavíkurborg',
              },
              rows: [
                [
                  {
                    title: 'Notkunareiningarnúmer',
                    value: 'N2059550',
                  },
                  {
                    title: 'Gildandi fasteignamat',
                    value: '55.400.000 kr.',
                  },
                ],
                [
                  {
                    title: 'Staðfang',
                    value: 'Einimelur 24',
                  },
                  {
                    title: 'Fyrirhugað fasteignamat 2022',
                    value: '59.950.000 kr',
                  },
                ],
              ],
            },
            {
              header: {
                title: 'Notkunareiningar',
                value: 'Einimelur 24, Reykjavíkurborg',
              },
              rows: chunk(
                [
                  {
                    title: 'Notkunareiningarnúmer',
                    value: 'N2059550',
                  },
                  {
                    title: 'Gildandi fasteignamat',
                    value: '55.400.000 kr.',
                  },
                  {
                    title: 'Staðfang',
                    value: 'Einimelur 24',
                  },
                  {
                    title: 'Fyrirhugað fasteignamat 2022',
                    value: '59.950.000 kr',
                  },
                ],
                2,
              ),
            },
          ]}
        />
      </Box>
      <Box marginTop={8}>
        <AssetDisclaimer />
      </Box>
    </>
  )
}

export default AssetsOverview
