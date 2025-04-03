import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const taxDiscountSubSection = buildSubSection({
  id: 'taxDiscountSubSection',
  title: 'taxDiscountSubSection',
  children: [
    buildMultiField({
      id: 'taxDiscountSubSection',
      title: payoutMessages.taxDiscount.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
