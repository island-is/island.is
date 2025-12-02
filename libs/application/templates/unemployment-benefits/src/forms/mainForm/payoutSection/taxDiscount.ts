import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const taxDiscountSubSection = buildSubSection({
  id: 'taxDiscountSubSection',
  title: payoutMessages.taxDiscount.sectionTitle,
  children: [
    buildMultiField({
      id: 'taxDiscountSubSection',
      title: payoutMessages.taxDiscount.pageTitle,
      children: [
        buildDescriptionField({
          id: 'taxDiscountDescription',
          title: payoutMessages.taxDiscount.description,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'taxDiscount.taxDiscount',
          title: payoutMessages.taxDiscount.taxDiscountLabel,
          placeholder: payoutMessages.taxDiscount.taxDiscountPlaceholder,
          variant: 'number',
          allowNegative: false,
          max: 100,
          suffix: '%',
        }),
        buildAlertMessageField({
          id: 'taxDiscountAlertMessage',
          message: payoutMessages.taxDiscount.taxDiscountAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
