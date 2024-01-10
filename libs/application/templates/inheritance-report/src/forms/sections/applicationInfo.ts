import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'

import { m } from '../../lib/messages'

export const applicationInfo = buildSection({
  id: 'applicationInfo',
  title: m.applicationInfoSectionTitle,
  children: [
    buildDescriptionField({
      id: 'applicationDescription',
      space: 2,
      title: m.applicationInfoSectionTitle,
      description: m.applicationInfoText,
    }),
  ],
})
