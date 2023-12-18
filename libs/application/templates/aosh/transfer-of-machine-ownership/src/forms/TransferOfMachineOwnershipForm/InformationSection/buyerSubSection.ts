import {
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
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
        buildNationalIdWithNameField({
          id: 'buyer',
          title: information.labels.buyer.nationalId,
          width: 'full',
        }),
        buildTextField({
          id: 'buyer.email',
          title: information.labels.buyer.email,
          width: 'half',
          variant: 'email',
          required: true,
        }),
        buildPhoneField({
          id: 'buyer.phone',
          title: information.labels.buyer.phone,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
