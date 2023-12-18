import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  formatCurrency,
} from '@island.is/application/ui-components'
import { m } from '../../lib/messages'

export const overviewAssets = [
  buildDescriptionField({
    id: 'overviewEstateHeader',
    title: m.assetNumber,
    description: m.realEstateDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const realEstateAssets = answers.assets.realEstate 
        return  (
          (realEstateAssets.filter(
            (asset: any) => asset.enabled,
          ) ?? []
        ).map((asset: any) => ({
          title: asset.description,
          description: [
            `${m.assetNumber.defaultMessage}: ${asset.assetNumber}`,
            m.realEstateEstimation.defaultMessage +
              ': ' +
              (asset.marketValue ? formatCurrency(asset.marketValue) : '0 kr.'),
            m.propertyShare.defaultMessage +
              ': ' +
              (asset.share ? asset.share + '%' : '0%'),
          ],
        }))
      }
       ,
    },
  ),
]