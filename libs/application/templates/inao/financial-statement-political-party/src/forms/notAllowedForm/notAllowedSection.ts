import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const notAllowedSection = buildSection({
  id: 'notAllowedSection',
  children: [
    buildDescriptionField({
      id: 'notAllowedDescription',
      title: m.notAllowedTitle,
      description: m.notAllowedDescription,
    }),
  ],
})
