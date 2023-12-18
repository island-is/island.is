import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { EstateAsset } from '@island.is/clients/syslumenn'
import { EstateAssets } from '../../types'

export const overviewAssets = [
  buildDescriptionField({
    id: 'overviewRealEstate',
    title: m.realEstate,
    titleVariant: 'h3',
    marginBottom: 'gutter',
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
        const realEstateAssets = (answers.assets as unknown as EstateAssets).realEstate.data
        return (
          realEstateAssets.map((asset: any) => ({
            title: asset.description,
            description: [
              `${m.assetNumber.defaultMessage}: ${asset.assetNumber}`,
              m.realEstateEstimation.defaultMessage +
                ': ' +
                (asset.propertyValuation
                  ? formatCurrency(asset.propertyValuation)
                  : '0 kr.'),
            ],
          })) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.realEstateEstimation,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.realEstate.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewVehicles',
    title: m.vehicles,
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
      cards: (application: Application) => {
        const answers = application.answers
        const realEstateAssets = (answers.assets as unknown as EstateAssets).vehicles.data
        return (
          realEstateAssets.map((asset: any) => ({
            title: asset.description,
            description: [
              `${m.vehicleNumberLabel.defaultMessage}: ${asset.assetNumber}`,
                m.vehicleValuation.defaultMessage +
                ': ' +
                (asset.propertyValuation
                  ? formatCurrency(asset.propertyValuation)
                  : '0 kr.'),
            ],
          })) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.marketValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.vehicles.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewGuns',
    title: m.guns,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.marketValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.guns.total')
      return formatCurrency(String(total))
    },
  }),
]
