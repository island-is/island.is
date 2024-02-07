import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'

import { m } from '../../lib/messages'

export const applicationInfo = buildSection({
  id: 'applicationInfoSection',
  title: m.applicationInfoSectionTitle,
  children: [
    buildDescriptionField({
      id: 'applicationInfo',
      space: 2,
      title: m.applicationInfoTitle,
      description: m.applicationInfoText,
    }),
  ],
})
