import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { axleSpacing } from '../../../lib/messages'

export const axleSpacingSection = buildSection({
  id: 'axleSpacingSection',
  title: axleSpacing.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'axleSpacingMultiField',
      title: axleSpacing.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'lorem ipsum',
        }),
      ],
    }),
  ],
})
