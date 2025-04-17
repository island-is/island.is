import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { location } from '../../../lib/messages'

export const locationSection = buildSection({
  id: 'locationSection',
  title: location.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'locationMultiField',
      title: location.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'lorem ipsum',
        }),
      ],
    }),
  ],
})
