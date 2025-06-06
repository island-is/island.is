import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const photoSection = buildSection({
  id: 'photoSection',
  title: m.photoMessages.title,
  children: [
    buildMultiField({
      id: 'photoMultiField',
      title: m.photoMessages.title,
      description: m.photoMessages.description,
      children: [
        buildFileUploadField({
          id: 'photos',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
