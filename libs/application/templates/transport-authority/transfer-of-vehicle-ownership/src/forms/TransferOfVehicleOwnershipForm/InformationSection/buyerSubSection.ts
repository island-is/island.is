import {
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const buyerSubSection = buildSubSection({
  id: 'buyer',
  title: 'Kaupandi',
  children: [
    buildMultiField({
      id: 'buyerMultiField',
      title: information.labels.buyer.title,
      description: information.general.description,
      children: [
        buildCustomField({
          id: 'buyer',
          component: 'NationalIdWithName',
          title: '',
        }),
        buildTextField({
          id: 'buyer.phone',
          title: information.labels.buyer.phone,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          required: true,
        }),
        buildTextField({
          id: 'buyer.email',
          title: information.labels.buyer.email,
          width: 'half',
          variant: 'email',
          required: true,
        }),
      ],
    }),
  ],
})
