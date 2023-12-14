import {
  buildCustomField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { information } from '../../lib/messages'

export const buyerOperatorSubSection = buildSubSection({
  id: 'buyerOperator',
  title: information.labels.buyer.sectionTitle,

  children: [
    buildMultiField({
      id: 'buyerOperatorMultiField',
      title: information.labels.buyer.title,
      description: information.labels.buyer.description,
      children: [
        // NationalIdwithName custom component
        buildTextField({
          id: 'buyerOperator.email',
          title: information.labels.buyer.email,
          width: 'half',
          variant: 'email',
          required: false,
        }),
        buildPhoneField({
          id: 'buyerOperator.phone',
          title: information.labels.buyer.phone,
          width: 'half',
          required: false,
        }),
      ],
    }),
  ],
})
