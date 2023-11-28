import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const buyerSubSection = buildSubSection({
  id: 'buyer',
  title: information.labels.buyer.sectionTitle,
  children: [
    buildMultiField({
      id: 'buyerMultiField',
      title: information.labels.buyer.title,
      description: information.labels.buyer.description,
      children: [
        buildCustomField({
          id: 'buyerCustomField',
          component: 'BuyerField',
          title: '',
        }),
      ],
    }),
  ],
})
