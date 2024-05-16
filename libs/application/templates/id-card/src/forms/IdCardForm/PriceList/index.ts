import {
  buildMultiField,
  buildDescriptionField,
  buildSection,
  buildRadioField,
  buildSelectField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { priceList } from '../../../lib/messages/priceList'
import { checkForDiscount } from '../../../utils'
import { Application } from '@island.is/application/types'

export const PriceListSubSection = buildSection({
  id: Routes.PRICELIST,
  title: priceList.general.sectionTitle,
  children: [
    buildMultiField({
      id: `${Routes.PRICELIST}MultiField`,
      title: priceList.general.sectionTitle,
      description: priceList.general.description,
      children: [
        buildRadioField({
          id: `${Routes.PRICELIST}.priceChoice`,
          title: '',
          options: (application) => {
            const hasDiscount = checkForDiscount(application)
            return [
              {
                label: !hasDiscount
                  ? priceList.labels.regularPriceTitle
                  : priceList.labels.discountRegularPriceTitle,
                subLabel: priceList.labels.regularPriceDescription,
                value: !hasDiscount ? 'regular' : 'regularDiscount',
              },
              {
                label: !hasDiscount
                  ? priceList.labels.fastPriceTitle
                  : priceList.labels.discountFastPriceTitle,
                subLabel: priceList.labels.fastPriceDescription,
                value: !hasDiscount ? 'fast' : 'fastDiscount',
              },
            ]
          },
        }),
        buildDescriptionField({
          id: `${Routes.PRICELIST}.locationTitle`,
          title: priceList.labels.locationTitle,
          description: priceList.labels.locationDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
          marginTop: 'gutter',
        }),
        buildSelectField({
          id: `${Routes.PRICELIST}.location`,
          title: priceList.labels.locationTitle,
          placeholder: priceList.labels.locationPlaceholder,
          options: [
            {
              label: 'todo',
              value: 'todo',
            },
          ],
        }),
      ],
    }),
  ],
})
