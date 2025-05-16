import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const photoSection = buildSection({
  id: 'photoSection',
  title: 'Myndir',
  children: [
    buildMultiField({
      id: 'photoMultiField',
      title: m.photoMessages.title,
      description: m.photoMessages.description,
      children: [
        buildFileUploadField({
          id: 'photo',
          title: 'Mynd',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
