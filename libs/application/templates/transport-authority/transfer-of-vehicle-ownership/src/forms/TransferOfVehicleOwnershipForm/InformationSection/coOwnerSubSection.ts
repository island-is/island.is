import {
  buildMultiField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const coOwnerSubSection = buildSubSection({
  id: 'coOwner',
  title: 'Meðeigandi',
  children: [
    buildMultiField({
      id: 'coOwnerMultiField',
      title: information.labels.coOwner.title,
      description: information.general.description,
      children: [
        buildTextField({
          id: 'coOwner.nationalId',
          title: information.labels.coOwner.nationalId,
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
          format: '######-####',
          required: true,
        }),
        buildTextField({
          id: 'coOwner.name',
          title: information.labels.coOwner.name,
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
          required: true,
        }),
        buildTextField({
          id: 'coOwner.phone',
          title: information.labels.coOwner.phone,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          required: true,
        }),
        buildTextField({
          id: 'coOwner.email',
          title: information.labels.coOwner.email,
          width: 'half',
          variant: 'email',
          required: true,
        }),
      ],
    }),
  ],
})
