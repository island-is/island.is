import {
  buildMultiField,
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { priceList } from '../../../lib/messages/priceList'

export const PriceListSubSection = buildSection({
  id: Routes.PRICELIST,
  title: priceList.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.PRICELIST,
      title: 'TODO',
      children: [
        buildDescriptionField({
          id: `${Routes.PRICELIST}.title`,
          title: 'todo',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
