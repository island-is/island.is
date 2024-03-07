import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { location } from '../../../lib/messages'

export const locationSubSection = buildSubSection({
  id: 'locationSubSection',
  title: location.general.title,
  children: [
    buildMultiField({
      id: 'location',
      title: location.general.title,
      description: location.general.description,
      children: [
        buildTextField({
          id: 'location.address',
          title: location.labels.addressLabel,
          width: 'half',
          variant: 'text',
          required: true,
        }),
        buildTextField({
          id: 'location.postalCode',
          title: location.labels.postCodeLabel,
          width: 'half',
          variant: 'text',
          required: true,
        }),
        buildTextField({
          id: 'location.city',
          title: location.labels.city,
          width: 'half',
          variant: 'text',
          required: true,
        }),
        buildTextField({
          id: 'location.comment',
          title: location.labels.commentTitle,
          width: 'full',
          variant: 'textarea',
          required: true,
          placeholder: location.labels.commentPlaceholder,
          rows: 5,
        }),
      ],
    }),
  ],
})
