import {
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { conclusion, information } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

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
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: 'confirmation',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'confirmation',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
