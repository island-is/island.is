import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { convoy } from '../../../lib/messages'

export const convoySection = buildSection({
  id: 'convoySection',
  title: convoy.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'convoyMultiField',
      title: convoy.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'TODOx lorem ipsum',
        }),
      ],
    }),
  ],
})
