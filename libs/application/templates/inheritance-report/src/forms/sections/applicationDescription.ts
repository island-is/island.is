import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'

import { m } from '../../lib/messages'

export const applicationDescription = buildSection({
  id: 'applicationDescription',
  title: m.applicationDescriptionSectionTitle,
  children: [
    buildDescriptionField({
      id: 'applicationDescription',
      space: 2,
      title: m.applicationDescriptionTitle,
      description: m.applicationDescriptionText,
    }),
  ],
})
