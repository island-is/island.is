import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { vehicleSpacing } from '../../../lib/messages'

export const vehicleSpacingSection = buildSection({
  id: 'vehicleSpacingSection',
  title: vehicleSpacing.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleSpacingMultiField',
      title: vehicleSpacing.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'TODOx lorem ipsum',
        }),
      ],
    }),
  ],
})
