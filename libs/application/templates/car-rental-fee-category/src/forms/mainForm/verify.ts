import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const verifySection = buildSection({
  id: 'verifySection',
  title: m.verify.sectionTitle,
  children: [
    buildMultiField({
      id: 'verifyMultiField',
      title: m.verify.multiTitle,
      children: [
        buildDescriptionField({
          id: 'verifyDescription',
          description: m.verify.description,
        }),
      ],
    }),
  ],
})
