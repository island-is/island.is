import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const buyerSubSection = buildSubSection({
  id: 'buyerSubSection',
  title: information.labels.buyer.sectionTitle,
  children: [
    buildMultiField({
      id: 'buyerMultiField',
      title: information.labels.buyer.title,
      description: information.labels.buyer.description,
      children: [
        buildCustomField({
          id: 'buyer',
          component: 'Buyer',
        }),
        buildCustomField({
          id: 'buyerCoOwnerAndOperator',
          component: 'BuyerCoOwnerAndOperatorRepeater',
        }),
      ],
    }),
  ],
})
